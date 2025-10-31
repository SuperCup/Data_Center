# 小店活动分析页面时段分析坐标刻度调整

## 修改时间
2025年1月27日

## 修改内容

### 1. 页面时段分析横坐标刻度调整
- **位置调整**: 将横坐标刻度从底部移动到顶部显示
- **刻度格式**: 改为0-23点，每小时一格，去掉":00"后缀
- **布局优化**: 
  - 增加上方padding为40px，为横坐标预留空间
  - 调整左边距为50px，避免Y轴标签重叠
  - 使用grid布局确保刻度对齐

### 2. 模态弹窗时段分析横坐标刻度调整
- **位置调整**: 将横坐标刻度从表格内部移动到顶部显示
- **刻度格式**: 保持0-23点，每小时一格
- **布局优化**:
  - 使用绝对定位将横坐标显示在顶部
  - 增加容器paddingTop为30px
  - 调整Y轴标签宽度为50px

### 3. 坐标刻度优化
- **避免重叠**: 通过调整margin和padding确保坐标刻度不与边框重叠
- **对齐优化**: 使用grid布局确保横坐标与数据列完美对齐
- **字体调整**: 横坐标字体大小调整为11px和10px，确保清晰显示

## 技术实现

### 页面热力图修改
```tsx
// X轴标签 - 显示在上方
<div style={{ 
  position: 'absolute', 
  top: '-35px', 
  left: '0', 
  width: '100%', 
  display: 'grid',
  gridTemplateColumns: 'repeat(24, 1fr)',
  fontSize: '11px',
  color: '#666'
}}>
  {Array.from({ length: 24 }, (_, i) => (
    <div key={i} style={{ textAlign: 'center', padding: '0 1px' }}>
      {`${i}`}
    </div>
  ))}
</div>
```

### 模态弹窗热力图修改
```tsx
// 表头 - 小时 - 显示在上方
<div style={{ 
  position: 'absolute',
  top: 0,
  left: 60,
  right: 0,
  display: 'grid',
  gridTemplateColumns: 'repeat(24, 1fr)',
  gap: 2,
  fontSize: 10,
  color: '#666'
}}>
  {Array.from({ length: 24 }, (_, hour) => (
    <div key={hour} style={{ textAlign: 'center', padding: '4px 2px' }}>
      {hour}
    </div>
  ))}
</div>
```

## 修改效果
- 横坐标刻度现在显示在热力图上方，避免与下方的工作日/周末色块说明重叠
- 每小时一格的刻度显示更加清晰，便于用户查看具体时段
- 坐标刻度与边框保持适当距离，避免视觉重叠
- 页面和模态弹窗的显示风格保持一致

## 文件修改
- `src/pages/client/store-marketing/SmallStoreActivityAnalysis.tsx`
  - 修改页面时段分析热力图的横坐标显示位置和格式
  - 修改模态弹窗时段分析热力图的横坐标显示位置和格式
  - 调整相关布局和样式