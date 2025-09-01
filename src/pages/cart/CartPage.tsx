import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button, Card, EmptyState, Input } from '../shared/ui';
import { useCart } from '../entities/cart';
import { useTelegram } from '../shared/telegram';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { showMainButton, hideMainButton, haptic } = useTelegram();
  
  const { 
    items, 
    total,