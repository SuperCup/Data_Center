# 时段分析热力图坐标刻度修复

## 修改时间
2025年1月26日

## 问题描述
页面中时段分析热力图的横纵坐标刻度超出了区域边框，与边框线有重叠，显示不正常。

## 修改内容

### 1. 页面时段分析热力图坐标修复

#### 修改前的问题：
- 横坐标刻度使用 `top: '-35px'` 绝对定位，可能超出容器边界
- 纵坐标刻度使用 `left: '-50px'` 绝对定位，也可能超出容器边界
- 热力图容器的边距设置不合理，导致坐标刻度显示异常

#### 修改后的改进：
1. **容器边距优化**：
   - 将外层容器的 `padding` 从 `'40px 0 20px 0'` 调整为 `'50px 20px 30px 60px'`
   - 为坐标刻度预留足够的显示空间

2. **热力图容器尺寸调整**：
   - 将 `height: '100%'` 改为 `height: 'calc(100% - 80px)'`
   - 将 `width: '100%'` 改为 `width: 'calc(100% - 80px)'`
   - 移除 `marginLeft` 和 `marginRight`，改用 `position: 'relative'`

3. **横坐标刻度位置优化**：
   - 将 `top: '-35px'` 调整为 `top: '-25px'`
   - 减少与容器顶部的距离，避免超出边界

4. **纵坐标刻度位置优化**：
   - 将 `left: '-50px'` 调整为 `left: '-40px'`
   - 减少与容器左侧的距离，避免超出边界

5. **文字样式优化**：
   - 为横纵坐标刻度添加 `lineHeight: '1'` 样式
   - 确保文字垂直居中显示

### 2. 技术实现代码

```tsx
{/* 左侧热力图 */}
<div style={{ flex: 1, position: 'relative', padding: '50px 20px 30px 60px' }}>
  {/* 热力图容器 */}
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(24, 1fr)', 
    gridTemplateRows: 'repeat(7, 1fr)', 
    gap: '2px',
    height: 'calc(100% - 80px)',
    width: 'calc(100% - 80px)',
    position: 'relative'
  }}>
    {/* Y轴标签 */}
    <div style={{ 
      position: 'absolute', 
      left: '-40px', 
      top: '0', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-around',
      fontSize: '12px',
      color: '#666'
    }}>
      {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map(day => (
        <div key={day} style={{ textAlign: 'right', lineHeight: '1' }}>{day}</div>
      ))}
    </div>
    
    {/* X轴标签 - 显示在上方 */}
    <div style={{ 
      position: 'absolute', 
      top: '-25px', 
      left: '0', 
      width: '100%', 
      display: 'grid',
      gridTemplateColumns: 'repeat(24, 1fr)',
      fontSize: '11px',
      color: '#666'
    }}>
      {Array.from({ length: 24 }, (_, i) => (
        <div key={i} style={{ textAlign: 'center', padding: '0 1px', lineHeight: '1' }}>
          {`${i}`}
        </div>
      ))}
    </div>
    
    {/* 热力图数据点 */}
    {/* ... 数据点渲染逻辑保持不变 ... */}
  </div>
</div>
```

## 修改效果
- ✅ 横坐标刻度不再超出容器边界
- ✅ 纵坐标刻度不再超出容器边界  
- ✅ 热力图显示区域合理，坐标刻度清晰可见
- ✅ 整体布局更加协调，用户体验得到改善

## 模态弹窗时段分析
模态弹窗中的时段分析热力图布局已经比较合理，使用了 `paddingTop: 30` 和合适的绝对定位，无需额外修改。

## 总结
通过调整容器边距、优化坐标刻度位置和改进布局方式，成功解决了页面时段分析热力图横纵坐标刻度超出边框的问题，确保了界面的正常显示和良好的用户体验。