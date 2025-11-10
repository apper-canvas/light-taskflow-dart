import Badge from '@/components/atoms/Badge'

const CategoryTag = ({ category }) => {
  if (!category) return null

  return (
    <Badge variant="category" style={{ backgroundColor: `${category.color}20`, color: category.color, borderColor: `${category.color}40` }}>
      {category.name}
    </Badge>
  )
}

export default CategoryTag