import React from 'react';
import { render, screen } from '@testing-library/react';
import { MenuItemsClient } from '../menu-items-client';

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}));

describe('MenuItemsClient', () => {
  const mockProps = {
    restaurant: { id: 'r1', name: 'Test Restaurant', currency: 'USD' },
    menus: [{ id: 'm1', name: 'Dinner Menu' }],
    categories: [{ id: 'c1', name: 'Starters', menu_id: 'm1', sort_order: 1 }],
    items: [
      {
        id: 'i1',
        name: 'Garlic Bread',
        description: 'Warm and crispy',
        price: 5.99,
        category_id: 'c1',
        restaurant_id: 'r1',
        is_available: true,
        is_popular: false,
        is_vegetarian: true,
        is_vegan: false,
        is_gluten_free: false,
        is_spicy: false,
        calories: 200,
        image_url: null,
      }
    ],
    menuId: 'm1',
  };

  it('renders successfully without crashing', () => {
    render(<MenuItemsClient {...mockProps} />);
    
    // Verify the item renders
    expect(screen.getByText('Garlic Bread')).toBeInTheDocument();
    expect(screen.getByText('Warm and crispy')).toBeInTheDocument();
  });
});
