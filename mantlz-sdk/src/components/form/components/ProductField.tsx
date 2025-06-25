import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import * as Form from '@radix-ui/react-form';
import { FormField } from '../types';
import { useAppearance } from '../hooks/useAppearance';
// useTheme hook removed - theme passed as prop

interface ProductFieldProps {
  field: FormField;
  formMethods: UseFormReturn<any>;
  className?: string;
  theme: string;
  appearance?: import('../types').Appearance;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  image?: string;
  quantity?: number;
}

export function ProductField({ field, formMethods, theme, appearance }: ProductFieldProps) {
  const { register, watch, setValue } = formMethods;
  const selectedProducts = watch(field.name) || [];
  const { 
    getLabelStyles, 
    getInputStyles, 
    getElementClasses, 
    mergeClasses,
    styles 
  } = useAppearance(theme, appearance);
  
  const elementClasses = getElementClasses();

  // Format price for display
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  // Handle quantity change
  const handleQuantityChange = (productId: string, quantity: number) => {
    const currentProducts = selectedProducts;
    const productIndex = currentProducts.findIndex((p: Product) => p.id === productId);

    if (productIndex > -1) {
      if (quantity <= 0) {
        // Remove product if quantity is 0 or less
        currentProducts.splice(productIndex, 1);
      } else {
        // Update quantity
        currentProducts[productIndex].quantity = quantity;
      }
    } else if (quantity > 0) {
      // Add new product
      const product = field.products?.find(p => p.id === productId);
      if (product) {
        currentProducts.push({ ...product, quantity });
      }
    }

    setValue(field.name, [...currentProducts]);
  };

  return (
    <Form.Field name={field.name} style={styles.field.container}>
      <Form.Label style={styles.field.label}>
        {field.label}
        {field.required && <span style={{ color: 'var(--red-9)' }}>*</span>}
      </Form.Label>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {field.products?.map((product) => (
          <div 
            key={product.id} 
            style={{
              ...styles.field.input,
              padding: '1rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start'
            }}
          >
            {product.image ? (
              <div style={{ width: '4rem', height: '4rem', flexShrink: 0, overflow: 'hidden', borderRadius: '0.375rem' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div style={{ 
                width: '4rem', 
                height: '4rem', 
                flexShrink: 0,
                borderRadius: '0.375rem',
                background: 'var(--gray-3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'var(--gray-9)', fontSize: '0.75rem' }}>No image</span>
              </div>
            )}
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ 
                fontWeight: 500, 
                fontSize: '0.875rem',
                color: 'black',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {product.name}
              </h4>
              
              {product.description && (
                <p style={{ 
                  fontSize: '0.75rem',
                  color: 'var(--gray-20)',
                  marginTop: '0.25rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {product.description}
                </p>
              )}
              
              <div style={{ 
                marginTop: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ 
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  color: 'black'
                }}>
                  {formatPrice(product.price, product.currency)}
                </span>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const current = selectedProducts.find((p: Product) => p.id === product.id)?.quantity || 0;
                      handleQuantityChange(product.id, Math.max(0, current - 1));
                    }}
                    style={{
                      ...styles.button,
                      backgroundColor: 'var(--gray-4)',
                      color: 'black',
                      width: '1.5rem',
                      height: '1.5rem',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    -
                  </button>
                  
                  <span style={{ 
                    width: '2rem',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    color: 'black'
                  }}>
                    {selectedProducts.find((p: Product) => p.id === product.id)?.quantity || 0}
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => {
                      const current = selectedProducts.find((p: Product) => p.id === product.id)?.quantity || 0;
                      handleQuantityChange(product.id, current + 1);
                    }}
                    style={{
                      ...styles.button,
                      backgroundColor: 'var(--gray-4)',
                      color: 'black',
                      width: '1.5rem',
                      height: '1.5rem',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hidden input to store selected products */}
      <input
        type="hidden"
        {...register(field.name)}
        value={JSON.stringify(selectedProducts)}
      />
    </Form.Field>
  );
}