import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Form, Tabs, message, Space, Typography, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined, WechatOutlined, EyeInvisibleOutlined, EyeTwoTone, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import loginBg from '../../assets/loginbg.png';
import './Login.css';

const { TabPane } = Tabs;
const { Text, Link } = Typography;

type LoginType = 'account' | 'wechat' | 'phone';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loginType, setLoginType] = useState<LoginType>('account');
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>(''); // 微信二维码URL
  const [countdown, setCountdown] = useState(0); // 验证码倒计时
  const [agreed, setAgreed] = useState<boolean>(true); // 用户协议同意状态（默认已勾选）

  // 账号密码登录
  const handleAccountLogin = async (values: { username: string; password: string }) => {
    if (!agreed) {
      message.warning('请先阅读并同意《用户协议》和《隐私政策》');
      return;
    }
    
    setLoading(true);
    try {
      // 验证账号密码
      if (values.username === 'admin' && values.password === '123456') {
        // 模拟登录请求
        await new Promise(resolve => setTimeout(resolve, 500));
        
        message.success('登录成功');
        navigate('/client');
      } else {
        message.error('账号或密码错误，请重新输入');
      }
    } catch (error) {
      message.error('登录失败，请检查账号密码');
    } finally {
      setLoading(false);
    }
  };

  // 手机验证码登录
  const handlePhoneLogin = async (values: { phone: string; code: string }) => {
    if (!agreed) {
      message.warning('请先阅读并同意《用户协议》和《隐私政策》');
      return;
    }
    
    setLoading(true);
    try {
      // TODO: 调用登录API
      console.log('手机验证码登录:', values);
      
      // 模拟登录请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('登录成功');
      navigate('/client');
    } catch (error) {
      message.error('登录失败，请检查验证码');
    } finally {
      setLoading(false);
    }
  };

  // 发送验证码
  const handleSendCode = async () => {
    const phone = form.getFieldValue('phone');
    if (!phone) {
      message.warning('请输入手机号');
      return;
    }
    
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      message.warning('请输入正确的手机号');
      return;
    }

    try {
      // TODO: 调用发送验证码API
      console.log('发送验证码到:', phone);
      
      // 模拟发送验证码
      message.success('验证码已发送');
      
      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      message.error('发送验证码失败');
    }
  };

  // 生成微信二维码
  useEffect(() => {
    if (loginType === 'wechat') {
      // TODO: 调用API获取微信登录二维码
      // 这里使用模拟数据
      setQrCodeUrl('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=wechat-login-token-12345');
    }
  }, [loginType]);

  // 检查微信扫码状态
  useEffect(() => {
    if (loginType === 'wechat' && qrCodeUrl) {
      // TODO: 轮询检查扫码状态
      const checkInterval = setInterval(() => {
        // 模拟检查扫码状态
        // 如果扫码成功，调用登录API并跳转
      }, 2000);

      return () => clearInterval(checkInterval);
    }
  }, [loginType, qrCodeUrl]);

  return (
    <div className="login-container">
      {/* 左侧背景区域 */}
      <div className="login-bg-section" style={{ backgroundImage: `url(${loginBg})` }}></div>
      
      {/* 右侧登录区域 */}
      <div className="login-content">
        <Card className="login-card">
          {/* 品牌标识 */}
          <div className="login-header">
            <div className="brand-title">
              <span className="brand-name">DSM Cloud</span>
            </div>
            <div className="brand-subtitle">Digital Shopper Marketing Cloud</div>
          </div>

          {/* 登录方式切换 */}
          <Tabs
            activeKey={loginType}
            onChange={(key) => setLoginType(key as LoginType)}
            className="login-tabs"
          >
            {/* 账号密码登录 */}
            <TabPane tab="账号密码" key="account">
              <Form
                form={form}
                name="account-login"
                onFinish={handleAccountLogin}
                autoComplete="off"
                size="large"
              >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: '请输入账号' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="admin"
                    suffix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请输入密码"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>
                <div className="login-hint">
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    请使用员工账号密码进行登录
                  </Text>
                </div>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    className="login-button"
                  >
                    登录
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)}>
                    <Text style={{ fontSize: '12px' }}>
                      已阅读并同意
                      <Link href="#" style={{ color: '#ff6b00', margin: '0 2px' }}>《用户协议》</Link>
                      <span>、</span>
                      <Link href="#" style={{ color: '#ff6b00' }}>《隐私政策》</Link>
                    </Text>
                  </Checkbox>
                </Form.Item>
              </Form>
            </TabPane>

            {/* 微信扫码登录 */}
            <TabPane tab="微信扫码" key="wechat">
              <div className="wechat-login-content">
                <div className="qr-code-container">
                  {qrCodeUrl ? (
                    <>
                      <Text style={{ fontSize: '16px', fontWeight: 500, marginBottom: 24, display: 'block', textAlign: 'center' }}>
                        使用微信扫码登录
                      </Text>
                      <div style={{ 
                        width: 200, 
                        height: 200, 
                        border: '1px solid #f0f0f0',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#fff',
                        margin: '0 auto'
                      }}>
                        <img 
                          src={qrCodeUrl} 
                          alt="微信登录二维码" 
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <div style={{ marginTop: 16, textAlign: 'center' }}>
                        <Text type="secondary" style={{ fontSize: '14px', display: 'block' }}>
                          扫码后
                        </Text>
                        <Text type="secondary" style={{ fontSize: '14px', display: 'block', marginTop: 4 }}>
                          请在微信中完成确认
                        </Text>
                      </div>
                    </>
                  ) : (
                    <div className="qr-code-loading">
                      <WechatOutlined style={{ fontSize: 48, color: '#ff6b00' }} />
                      <Text type="secondary" style={{ marginTop: 16, display: 'block' }}>
                        正在生成二维码...
                      </Text>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: 24, textAlign: 'center', whiteSpace: 'nowrap' }}>
                  <Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)}>
                    <Text style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                      已阅读并同意
                      <Link href="#" style={{ color: '#ff6b00', margin: '0 2px' }}>《用户协议》</Link>
                      <span>、</span>
                      <Link href="#" style={{ color: '#ff6b00' }}>《隐私政策》</Link>
                    </Text>
                  </Checkbox>
                </div>
              </div>
            </TabPane>

            {/* 手机验证码登录 */}
            <TabPane tab="手机验证码" key="phone">
              <Form
                form={form}
                name="phone-login"
                onFinish={handlePhoneLogin}
                autoComplete="off"
                size="large"
              >
                <Form.Item
                  name="phone"
                  rules={[
                    { required: true, message: '请输入手机号' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                  ]}
                >
                  <Input
                    prefix={<MobileOutlined />}
                    placeholder="请输入手机号"
                    maxLength={11}
                  />
                </Form.Item>
                <Form.Item
                  name="code"
                  rules={[{ required: true, message: '请输入验证码' }]}
                >
                  <Space.Compact style={{ width: '100%' }}>
                    <Input
                      placeholder="请输入验证码"
                      maxLength={6}
                      style={{ flex: 1 }}
                    />
                    <Button
                      onClick={handleSendCode}
                      disabled={countdown > 0}
                      style={{ width: 120 }}
                    >
                      {countdown > 0 ? `${countdown}秒` : '获取验证码'}
                    </Button>
                  </Space.Compact>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    className="login-button"
                  >
                    登录
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)}>
                    <Text style={{ fontSize: '12px' }}>
                      已阅读并同意
                      <Link href="#" style={{ color: '#ff6b00', margin: '0 2px' }}>《用户协议》</Link>
                      <span>、</span>
                      <Link href="#" style={{ color: '#ff6b00' }}>《隐私政策》</Link>
                    </Text>
                  </Checkbox>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login;
