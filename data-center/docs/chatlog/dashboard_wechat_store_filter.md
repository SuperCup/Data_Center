# Dashboard页面添加微信小店筛选选项功能

## 修改时间
2024年12月19日

## 修改内容
在 `Dashboard.tsx` 页面顶部筛选框中添加"微信小店"选项，并实现点击跳转到 `SmalStoreDashboard.tsx` 页面的功能。

## 具体修改

### 1. 导入路由导航hook
```typescript
import { useNavigate } from 'react-router-dom';
```

### 2. 添加导航hook
```typescript
const navigate = useNavigate();
```

### 3. 添加平台变更处理函数
```typescript
// 处理平台变更
const handlePlatformChange = (e: any) => {
  const value = e.target.value;
  if (value === 'wechat-store') {
    // 跳转到微信小店页面
    navigate('/client/store-marketing/small-store-dashboard');
  } else {
    setPlatform(value);
  }
};
```

### 4. 修改平台筛选框
在 `Radio.Group` 中添加微信小店选项：
```typescript
<Radio.Group value={platform} onChange={handlePlatformChange} buttonStyle="solid">
  <Radio.Button value="all">全部</Radio.Button>
  <Radio.Button value="wechat">微信</Radio.Button>
  <Radio.Button value="alipay">支付宝</Radio.Button>
  <Radio.Button value="douyin">抖音到店</Radio.Button>
  <Radio.Button value="wechat-store">微信小店</Radio.Button>
  <Radio.Button value="meituan" disabled>美团到店</Radio.Button>
  <Radio.Button value="tmall" disabled>天猫校园</Radio.Button>
</Radio.Group>
```

## 功能说明
- 在Dashboard页面顶部筛选框的"抖音到店"选项后添加了"微信小店"选项
- 点击"微信小店"选项时，页面会自动跳转到 `SmalStoreDashboard.tsx` 页面
- 其他平台选项的功能保持不变

## 技术实现
- 使用React Router的 `useNavigate` hook实现页面跳转
- 通过条件判断区分微信小店选项和其他平台选项的处理逻辑
- 保持原有的平台状态管理逻辑不变

## 修改效果
用户现在可以在Dashboard页面顶部的平台筛选框中看到"微信小店"选项，点击该选项后会跳转到对应的微信小店仪表板页面。