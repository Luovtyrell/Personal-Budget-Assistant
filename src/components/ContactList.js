import { ListItem, ListItemAvatar, Avatar, ListItemText, Button } from '@mui/material';

function ContactList({ user }) {
    return (
        <ListItem key={user.id} sx={{ mb: 2 }}>
            <ListItemAvatar>
                <Avatar src={`https://i.pravatar.cc/150?img=${user.id}`} alt={user.name} />
            </ListItemAvatar>
            <ListItemText
                primary={`${user.name} - ${user.email}`}
                secondary={`Phone: ${user.phone} | Company: ${user.company.name}`}
            />
            <Button
                variant="contained"
                color="primary"
                href={`mailto:${user.email}`}
                sx={{ ml: 2 }}
            >
                Contact
            </Button>
        </ListItem>
    );
}

export default ContactList;
