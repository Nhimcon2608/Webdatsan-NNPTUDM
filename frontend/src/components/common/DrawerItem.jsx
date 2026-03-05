import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

const DrawerItem = ({
    icon,
    label,
    tabKey,
    activeTab,
    setActiveTab,
    isMobile,
    setMobileOpen,
    theme,
    user,
    requireLogin,
    setOpenLoginModal
}) => {
    const isSelected = activeTab === tabKey;

    const handleClick = () => {
        if (requireLogin && !user) {
            setOpenLoginModal(true);
            return;
        }

        setActiveTab(tabKey);

        if (isMobile) {
            setMobileOpen(false);
        }
    };

    return (
        <ListItem disablePadding>
            <ListItemButton
                selected={isSelected}
                onClick={handleClick}
                sx={{
                    py: 1.5,
                    px: 2,
                    borderRadius: 1,
                    borderLeft: `4px solid ${isSelected ? theme.palette.primary.main : 'transparent'}`,
                    bgcolor: isSelected ? theme.palette.action.selected : 'transparent',
                    '&:hover': {
                        bgcolor: theme.palette.action.hover,
                        '& .MuiListItemIcon-root': {
                            color: theme.palette.primary.dark,
                        },
                        '& .MuiListItemText-primary': {
                            color: theme.palette.primary.dark,
                        },
                    },
                    transition: 'all 0.2s ease-in-out',
                }}
            >
                <ListItemIcon sx={{ minWidth: 40, color: theme.palette.text.primary }}>
                    {icon}
                </ListItemIcon>
                <ListItemText
                    primary={label}
                    sx={{
                        '& .MuiTypography-root': {
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                        },
                    }}
                />
            </ListItemButton>
        </ListItem>
    );
};

export default DrawerItem;
