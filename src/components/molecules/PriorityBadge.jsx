import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const PriorityBadge = ({ priority }) => {
  const priorityConfig = {
    high: {
      variant: "high",
      icon: "AlertCircle",
      label: "High"
    },
    medium: {
      variant: "medium", 
      icon: "Clock",
      label: "Medium"
    },
    low: {
      variant: "low",
      icon: "ArrowDown",
      label: "Low"
    }
  }

  const config = priorityConfig[priority] || priorityConfig.medium

  return (
    <Badge variant={config.variant}>
      <ApperIcon name={config.icon} className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  )
}

export default PriorityBadge