import React from 'react';
import { List, ListItem, ListItemText, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import PropTypes from 'prop-types';

const Cart = ({ cartItems, setCartItems }) => {
    const navigate = useNavigate();

    const handlePlaceOrder = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/register');
            return;
        }

        const data = {
            items: cartItems.map(item => ({
                id: item.id,
                quantity: item.quantity
            }))
        };


        api.post('/orders', data)
            .then(() => {
                alert('Order placed successfully.');
                setCartItems([]);
                navigate('/products');
            })
            .catch(error => {
                console.error('Error placing order:', error);
                alert('Failed to place order.');
            });
    };

    return (
        <div>
            <h2>Cart</h2>
            <List>
                {cartItems.map((item) => (
                    <ListItem key={item.id} divider>
                        <ListItemText
                            primary={item.name}
                            secondary={`Quantity: ${item.quantity ?? 1}`}
                        />
                    </ListItem>
                ))}
            </List>
            {cartItems.length > 0 && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePlaceOrder}
                    style={{ marginTop: 16 }}
                >
                    Place Order
                </Button>
            )}
        </div>
    );
};

Cart.propTypes = {
    cartItems: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            quantity: PropTypes.number
        })
    ).isRequired,
    setCartItems: PropTypes.func.isRequired,
};

export default Cart;
