import { Outlet } from 'react-router-dom'
import { useAuth } from '@/layouts/Root'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

function Layout() {
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
      <div className="absolute top-4 right-4 z-50">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={logout}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ApperIcon name="LogOut" className="w-4 h-4" />
          Logout
        </Button>
      </div>
      <Outlet />
    </div>
  )
}

export default Layout