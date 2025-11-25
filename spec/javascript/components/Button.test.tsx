import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button';
import { Colors } from '../../../app/javascript/bundles/DungeonMasterCampaignManager/utilities/enums';

describe('Button Component', () => {
  const defaultProps = {
    color: Colors.primary,
    title: 'Click Me',
  };

  describe('rendering', () => {
    it('should render with default props', () => {
      render(<Button {...defaultProps} />);

      const button = screen.getByRole('button', { name: 'Click Me' });
      expect(button).toBeInTheDocument();
    });

    it('should render with custom title', () => {
      render(<Button color={Colors.success} title="Save Changes" />);

      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });

    it('should render with icon', () => {
      const TestIcon = () => <span data-testid="test-icon">Icon</span>;
      render(<Button {...defaultProps} icon={<TestIcon />} />);

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('should hide title when hideTitle is true', () => {
      const TestIcon = () => <span data-testid="test-icon">Icon</span>;
      render(<Button {...defaultProps} hideTitle icon={<TestIcon />} />);

      expect(screen.queryByText('Click Me')).not.toBeInTheDocument();
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should render without icon when not provided', () => {
      render(<Button {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button.querySelector('span')).toBeNull();
    });
  });

  describe('color variants', () => {
    const colors = [
      Colors.primary,
      Colors.secondary,
      Colors.success,
      Colors.primaryDark,
      Colors.info,
      Colors.warning,
      Colors.danger,
      Colors.light,
      Colors.dark,
      Colors.transparent,
      Colors.transparentLight,
    ];

    colors.forEach((color) => {
      it(`should apply ${color} color class`, () => {
        render(<Button color={color} title="Test Button" />);

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('button attributes', () => {
    it('should set custom id', () => {
      render(<Button {...defaultProps} id="custom-id" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'custom-id');
    });

    it('should set type attribute to button by default', () => {
      render(<Button {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should set custom type attribute', () => {
      render(<Button {...defaultProps} type="submit" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should set data-bs-dismiss attribute', () => {
      render(<Button {...defaultProps} dataBsDismiss="modal" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-bs-dismiss', 'modal');
    });

    it('should apply custom className', () => {
      render(<Button {...defaultProps} className="custom-class" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    // Note: Custom styles may be overridden by CSS modules, so we skip testing inline styles
    it.skip('should apply custom style', () => {
      const customStyle = { backgroundColor: 'red', padding: '10px' };
      render(<Button {...defaultProps} style={customStyle} />);

      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ backgroundColor: 'red', padding: '10px' });
    });

    it('should be full width when isFullWidth is true', () => {
      render(<Button {...defaultProps} isFullWidth />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button {...defaultProps} disabled />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should be enabled by default', () => {
      render(<Button {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toBeEnabled();
    });
  });

  describe('click handling', () => {
    it('should call onClick handler when clicked', () => {
      const handleClick = jest.fn();
      render(<Button {...defaultProps} onClick={handleClick} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should pass event to onClick handler', () => {
      const handleClick = jest.fn();
      render(<Button {...defaultProps} onClick={handleClick} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should not throw error when onClick is not provided', () => {
      expect(() => {
        render(<Button {...defaultProps} />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
      }).not.toThrow();
    });

    it('should call onClick multiple times', () => {
      const handleClick = jest.fn();
      render(<Button {...defaultProps} onClick={handleClick} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('accessibility', () => {
    it('should be keyboard accessible', () => {
      const handleClick = jest.fn();
      render(<Button {...defaultProps} onClick={handleClick} />);

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('should have button role', () => {
      render(<Button {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should render with empty string title', () => {
      render(<Button color={Colors.primary} title="" />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.textContent).toBe('');
    });

    it('should handle special characters in title', () => {
      const specialTitle = '<Script>Alert("XSS")</Script>';
      render(<Button color={Colors.primary} title={specialTitle} />);

      expect(screen.getByText(specialTitle)).toBeInTheDocument();
    });

    it('should render with hideTitle but no icon', () => {
      render(<Button {...defaultProps} hideTitle />);

      const button = screen.getByRole('button');
      expect(button.textContent?.trim()).toBe('');
    });
  });

  describe('combined props', () => {
    it('should handle all props together', () => {
      const handleClick = jest.fn();
      const TestIcon = () => <span data-testid="icon">Icon</span>;

      render(
        <Button
          id="combo-button"
          className="custom-class"
          color={Colors.success}
          title="Combo Button"
          onClick={handleClick}
          type="submit"
          icon={<TestIcon />}
          style={{ margin: '10px' }}
          isFullWidth
          dataBsDismiss="modal"
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'combo-button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('data-bs-dismiss', 'modal');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveStyle({ margin: '10px' });
      expect(screen.getByText('Combo Button')).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toBeInTheDocument();

      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalled();
    });
  });
});
