import React, { useEffect, useRef, useState } from 'react';
import { 
  Card, 
  Button, 
  Slider, 
  Space, 
  Typography, 
  Row, 
  Col, 
  Select, 
  InputNumber, 
  Divider,
  message,
  Modal
} from 'antd';
import { 
  DownloadOutlined, 
  RotateLeftOutlined, 
  RotateRightOutlined,
  ScissorOutlined,
  CompressOutlined,
  UndoOutlined,
  ArrowLeftOutlined,
  ExpandOutlined,
  BulbOutlined,
  ExperimentOutlined
} from '@ant-design/icons';
import { saveAs } from 'file-saver';

const { Title, Text } = Typography;
const { Option } = Select;

const SimpleImageEditor = ({ imageFile, imageUrl, onBack }) => {
  const canvasRef = useRef(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [quality, setQuality] = useState(0.8);
  const [outputFormat, setOutputFormat] = useState('image/png');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resizeModalVisible, setResizeModalVisible] = useState(false);
  const [resizeWidth, setResizeWidth] = useState(800);
  const [resizeHeight, setResizeHeight] = useState(600);
  const [imageAspectRatio, setImageAspectRatio] = useState(1);
  const [cropMode, setCropMode] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 200, height: 150 });

  useEffect(() => {
    if (canvasRef.current && imageUrl) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Set canvas dimensions
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;
        
        // Calculate aspect ratio and resize to fit
        const aspectRatio = width / height;
        setImageAspectRatio(aspectRatio);
        setResizeWidth(width);
        setResizeHeight(height);
        
        if (width > maxWidth) {
          width = maxWidth;
          height = width / aspectRatio;
        }
        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }
        
        canvas.width = width;
        canvas.height = height;
        canvas.style.maxWidth = '100%';
        canvas.style.height = 'auto';
        
        setOriginalImage(img);
        drawImage();
      };
      
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
    }
  }, [imageUrl]);

  const drawImage = () => {
    if (!canvasRef.current || !originalImage) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save context
    ctx.save();
    
    // Apply rotation
    if (rotation !== 0) {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }
    
    // Apply filters using CSS filters (works in modern browsers)
    let filters = [];
    if (brightness !== 0) {
      filters.push(`brightness(${100 + brightness}%)`);
    }
    if (contrast !== 0) {
      filters.push(`contrast(${100 + contrast}%)`);
    }
    
    ctx.filter = filters.join(' ') || 'none';
    
    // Draw image
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    
    // Draw crop overlay if in crop mode
    if (cropMode) {
      ctx.restore();
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Clear crop area
      ctx.clearRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
      
      // Draw crop border
      ctx.strokeStyle = '#1890ff';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
    }
    
    // Restore context
    ctx.restore();
  };

  useEffect(() => {
    drawImage();
  }, [brightness, contrast, rotation, cropMode, cropArea]);

  const handleRotateLeft = () => {
    setRotation((prev) => prev - 90);
  };

  const handleRotateRight = () => {
    setRotation((prev) => prev + 90);
  };

  const handleResize = () => {
    if (canvasRef.current && originalImage) {
      const canvas = canvasRef.current;
      canvas.width = resizeWidth;
      canvas.height = resizeHeight;
      drawImage();
      setResizeModalVisible(false);
      message.success('图片尺寸已调整');
    }
  };

  const toggleCropMode = () => {
    if (cropMode) {
      setCropMode(false);
    } else {
      setCropMode(true);
      // Reset crop area to center
      const canvas = canvasRef.current;
      if (canvas) {
        setCropArea({
          x: Math.max(0, (canvas.width - 200) / 2),
          y: Math.max(0, (canvas.height - 150) / 2),
          width: Math.min(200, canvas.width),
          height: Math.min(150, canvas.height)
        });
      }
      message.info('裁剪模式已开启，可以调整裁剪区域参数后确认裁剪');
    }
  };

  const handleCrop = () => {
    if (!canvasRef.current || !originalImage) return;
    
    setIsProcessing(true);
    
    try {
      const canvas = canvasRef.current;
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      
      tempCanvas.width = cropArea.width;
      tempCanvas.height = cropArea.height;
      
      // Draw cropped area
      tempCtx.drawImage(
        canvas,
        cropArea.x, cropArea.y, cropArea.width, cropArea.height,
        0, 0, cropArea.width, cropArea.height
      );
      
      // Update main canvas with cropped image
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(tempCanvas, 0, 0);
      
      setCropMode(false);
      setIsProcessing(false);
      message.success('图片裁剪完成');
    } catch (error) {
      message.error('裁剪失败');
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;

    setIsProcessing(true);

    try {
      const canvas = canvasRef.current;
      const dataURL = canvas.toDataURL(outputFormat, quality);

      // Convert dataURL to blob and download
      const arr = dataURL.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      const blob = new Blob([u8arr], { type: mime });
      const fileName = `edited_image_${Date.now()}.${outputFormat.split('/')[1]}`;
      saveAs(blob, fileName);

      message.success('图片下载成功');
    } catch (error) {
      message.error('下载失败');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetImage = () => {
    setBrightness(0);
    setContrast(0);
    setRotation(0);
    setCropMode(false);
    if (originalImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const aspectRatio = originalImage.width / originalImage.height;
      
      let width = originalImage.width;
      let height = originalImage.height;
      
      // Fit to max dimensions
      const maxWidth = 800;
      const maxHeight = 600;
      
      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
      }
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }
      
      canvas.width = width;
      canvas.height = height;
      drawImage();
    }
  };

  return (
    <div className="image-editor">
      <Card>
        <div style={{ marginBottom: '16px' }}>
          <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
            返回上传
          </Button>
          <Title level={4} style={{ display: 'inline-block', marginLeft: '16px', marginBottom: 0 }}>
            图片编辑器
          </Title>
        </div>

        <Row gutter={16}>
          <Col xs={24} lg={18}>
            <div className="canvas-container">
              <div className="canvas-wrapper">
                <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto' }} />
              </div>
            </div>
          </Col>

          <Col xs={24} lg={6}>
            <div className="toolbar">
              <div className="toolbar-section">
                <Title level={5}>
                  <RotateLeftOutlined /> 旋转操作
                </Title>
                <Space wrap>
                  <Button icon={<RotateLeftOutlined />} onClick={handleRotateLeft}>
                    左转90°
                  </Button>
                  <Button icon={<RotateRightOutlined />} onClick={handleRotateRight}>
                    右转90°
                  </Button>
                </Space>
              </div>

              <Divider />

              <div className="toolbar-section">
                <Title level={5}>
                  <ExpandOutlined /> 尺寸调整
                </Title>
                <Button 
                  icon={<ExpandOutlined />} 
                  onClick={() => setResizeModalVisible(true)}
                  block
                >
                  调整尺寸
                </Button>
              </div>

              <Divider />

              <div className="toolbar-section">
                <Title level={5}>
                  <ScissorOutlined /> 裁剪工具
                </Title>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button 
                    icon={<ScissorOutlined />} 
                    onClick={toggleCropMode}
                    type={cropMode ? 'primary' : 'default'}
                    block
                  >
                    {cropMode ? '取消裁剪' : '开始裁剪'}
                  </Button>
                  {cropMode && (
                    <>
                      <div>
                        <Text>裁剪区域设置:</Text>
                        <Space direction="vertical" style={{ width: '100%', marginTop: '8px' }}>
                          <div>
                            <Text>X: </Text>
                            <InputNumber
                              size="small"
                              min={0}
                              max={canvasRef.current?.width || 800}
                              value={cropArea.x}
                              onChange={(value) => setCropArea(prev => ({ ...prev, x: value || 0 }))}
                            />
                          </div>
                          <div>
                            <Text>Y: </Text>
                            <InputNumber
                              size="small"
                              min={0}
                              max={canvasRef.current?.height || 600}
                              value={cropArea.y}
                              onChange={(value) => setCropArea(prev => ({ ...prev, y: value || 0 }))}
                            />
                          </div>
                          <div>
                            <Text>宽: </Text>
                            <InputNumber
                              size="small"
                              min={10}
                              max={canvasRef.current?.width || 800}
                              value={cropArea.width}
                              onChange={(value) => setCropArea(prev => ({ ...prev, width: value || 100 }))}
                            />
                          </div>
                          <div>
                            <Text>高: </Text>
                            <InputNumber
                              size="small"
                              min={10}
                              max={canvasRef.current?.height || 600}
                              value={cropArea.height}
                              onChange={(value) => setCropArea(prev => ({ ...prev, height: value || 100 }))}
                            />
                          </div>
                        </Space>
                      </div>
                      <Button 
                        icon={<ScissorOutlined />} 
                        onClick={handleCrop}
                        loading={isProcessing}
                        block
                        type="primary"
                      >
                        确认裁剪
                      </Button>
                    </>
                  )}
                </Space>
              </div>

              <Divider />

              <div className="toolbar-section">
                <Title level={5}>
                  <BulbOutlined /> 亮度调整
                </Title>
                <Text>亮度: {brightness}</Text>
                <Slider
                  min={-100}
                  max={100}
                  step={1}
                  value={brightness}
                  onChange={setBrightness}
                />
              </div>

              <div className="toolbar-section">
                <Title level={5}>
                  <ExperimentOutlined /> 对比度调整
                </Title>
                <Text>对比度: {contrast}</Text>
                <Slider
                  min={-100}
                  max={100}
                  step={1}
                  value={contrast}
                  onChange={setContrast}
                />
              </div>

              <Divider />

              <div className="toolbar-section">
                <Title level={5}>
                  <CompressOutlined /> 导出设置
                </Title>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text>输出格式:</Text>
                    <Select 
                      value={outputFormat} 
                      onChange={setOutputFormat}
                      style={{ width: '100%', marginTop: '8px' }}
                    >
                      <Option value="image/png">PNG</Option>
                      <Option value="image/jpeg">JPG</Option>
                      <Option value="image/webp">WebP</Option>
                    </Select>
                  </div>
                  
                  {outputFormat !== 'image/png' && (
                    <div>
                      <Text>图片质量: {Math.round(quality * 100)}%</Text>
                      <Slider
                        min={0.1}
                        max={1}
                        step={0.1}
                        value={quality}
                        onChange={setQuality}
                      />
                    </div>
                  )}
                </Space>
              </div>

              <Divider />

              <div className="toolbar-section">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button 
                    type="primary" 
                    icon={<DownloadOutlined />} 
                    onClick={handleDownload}
                    loading={isProcessing}
                    block
                    size="large"
                  >
                    下载图片
                  </Button>
                  <Button 
                    icon={<UndoOutlined />} 
                    onClick={resetImage}
                    block
                  >
                    重置图片
                  </Button>
                </Space>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Resize Modal */}
      <Modal
        title="调整图片尺寸"
        open={resizeModalVisible}
        onOk={handleResize}
        onCancel={() => setResizeModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text>宽度 (像素):</Text>
            <InputNumber
              min={1}
              max={5000}
              value={resizeWidth}
              onChange={setResizeWidth}
              style={{ width: '100%', marginTop: '8px' }}
            />
          </div>
          <div>
            <Text>高度 (像素):</Text>
            <InputNumber
              min={1}
              max={5000}
              value={resizeHeight}
              onChange={setResizeHeight}
              style={{ width: '100%', marginTop: '8px' }}
            />
          </div>
          <Button 
            onClick={() => {
              setResizeHeight(Math.round(resizeWidth / imageAspectRatio));
            }}
            block
          >
            保持原始比例
          </Button>
        </Space>
      </Modal>
    </div>
  );
};

export default SimpleImageEditor;