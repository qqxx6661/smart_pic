import React, { useState, useRef } from 'react';
import { Layout, Upload, Card, Row, Col, Space, Typography, Button, message, Divider } from 'antd';
import { UploadOutlined, PictureOutlined, ToolOutlined } from '@ant-design/icons';
import SimpleImageEditor from './components/SimpleImageEditor';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;
const { Dragger } = Upload;

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleUpload = (file) => {
    // Check if file is an image
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只支持上传图片文件！');
      return false;
    }

    // Check file size (limit to 10MB)
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('图片大小不能超过 10MB！');
      return false;
    }

    // Create image URL for preview
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setImageFile(file);
    
    message.success(`${file.name} 上传成功`);
    return false; // Prevent default upload
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload: handleUpload,
    showUploadList: false,
    accept: 'image/*',
  };

  return (
    <Layout className="layout">
      <Header style={{ display: 'flex', alignItems: 'center', background: '#001529' }}>
        <PictureOutlined style={{ fontSize: '24px', color: 'white', marginRight: '16px' }} />
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          SmartPic - 智能图片处理工具
        </Title>
      </Header>
      
      <Content style={{ padding: '24px', minHeight: 'calc(100vh - 134px)' }}>
        {!imageFile ? (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Card>
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Title level={2}>
                  <ToolOutlined /> 功能强大的在线图片处理工具
                </Title>
                <Paragraph>
                  支持图片格式转换、压缩、裁剪、缩放、旋转等多种编辑功能，所有处理都在浏览器本地完成，保护您的隐私安全。
                </Paragraph>
                
                <Dragger {...uploadProps} style={{ margin: '40px 0' }}>
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                  </p>
                  <p className="ant-upload-text">点击或拖拽图片到此区域上传</p>
                  <p className="ant-upload-hint">
                    支持 JPG、PNG、WebP、GIF 等常见图片格式，文件大小不超过 10MB
                  </p>
                </Dragger>

                <Divider>功能特点</Divider>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={6}>
                    <Card size="small" title="格式转换">
                      <p>支持 JPG、PNG、WebP 等格式互转</p>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card size="small" title="图片压缩">
                      <p>智能压缩，减小文件大小</p>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card size="small" title="裁剪缩放">
                      <p>自由裁剪和缩放图片</p>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card size="small" title="效果调整">
                      <p>亮度、对比度、旋转等</p>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Card>
          </div>
        ) : (
          <SimpleImageEditor imageFile={imageFile} imageUrl={imageUrl} onBack={() => {
            setImageFile(null);
            setImageUrl(null);
            if (imageUrl) {
              URL.revokeObjectURL(imageUrl);
            }
          }} />
        )}
      </Content>
      
      <Footer style={{ textAlign: 'center', background: '#f0f2f5' }}>
        SmartPic ©2024 - 基于 React + Fabric.js 构建的在线图片处理工具
      </Footer>
    </Layout>
  );
}

export default App;
