import { useState } from 'react'
import { Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Menu, MenuItem, Tooltip } from '@mui/material'
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, Dashboard as DashboardIcon, RestaurantMenu as RestaurantMenuIcon, Kitchen as KitchenIcon, Inventory as InventoryIcon, People as PeopleIcon, ExitToApp as ExitToAppIcon, Home as HomeIcon } from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'

const drawerWidth = 260

const MainLayout = ({ children }) => {
    const [open, setOpen] = useState(true)
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [anchorEl, setAnchorEl] = useState(null)

    const toggleDrawer = () => setOpen(!open)

    const handleMenu = (event) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const menuItems = [
        { text: 'Inicio', icon: <HomeIcon />, path: '/', roles: ['ADMIN', 'CHEF', 'MOZO'] },
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard', roles: ['ADMIN'] },
        { text: 'Insumos', icon: <InventoryIcon />, path: '/admin/insumos', roles: ['ADMIN', 'CHEF'] },
        { text: 'Productos', icon: <RestaurantMenuIcon />, path: '/admin/productos', roles: ['ADMIN'] },
        { text: 'Comandas', icon: <KitchenIcon />, path: '/pos', roles: ['ADMIN', 'MOZO'] },
        { text: 'KDS (Cocina)', icon: <KitchenIcon />, path: '/kds', roles: ['ADMIN', 'CHEF'] },
        { text: 'Usuarios', icon: <PeopleIcon />, path: '/admin/usuarios', roles: ['ADMIN'] },
    ]

    const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role))

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.paper', boxShadow: 1 }}>
                <Toolbar>
                    <IconButton color="inherit" onClick={toggleDrawer} edge="start" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                        <Logo size={32} color="#EB8D29" />
                    </Box>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
                        Gastro<span style={{ color: '#ff9800' }}>Flow</span>
                    </Typography>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Opciones de perfil">
                            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                                <Avatar alt={user?.id} src="https://cdn-icons-png.freepik.com/512/11820/11820201.png" sx={{ border: '2px solid #ff9800' }} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            anchorEl={anchorEl}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem disabled>
                                <Typography textAlign="center">{user?.role}</Typography>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon><ExitToAppIcon fontSize="small" /></ListItemIcon>
                                <Typography textAlign="center">Cerrar Sesión</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        transition: 'width 0.3s',
                        ...(!open && { width: 70, overflowX: 'hidden' }),
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto', mt: 2 }}>
                    <List>
                        {filteredMenu.map((item) => (
                            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    onClick={() => navigate(item.path)}
                                    selected={location.pathname === item.path}
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                        mx: 1,
                                        mb: 1,
                                        borderRadius: 2,
                                        '&.Mui-selected': { bgcolor: 'primary.main', color: 'common.white', '& .MuiListItemIcon-root': { color: 'common.white' } }
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                {children}
            </Box>
        </Box>
    )
}

export default MainLayout
