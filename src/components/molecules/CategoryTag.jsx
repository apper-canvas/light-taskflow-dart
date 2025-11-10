import Badge from '@/components/atoms/Badge'

const CategoryTag = ({ category }) => {
  if (!category) return null

  return (
<Badge variant="category" style={{ 
      backgroundColor: `${category.color_c || category.color}20`, 
      color: category.color_c || category.color, 
      borderColor: `${category.color_c || category.color}40` 
    }}>
      {category.name_c || category.name}
    </Badge>
  )
}

export default CategoryTag