/**
 * ESLint Plugin for Design Token Governance
 * Flags hardcoded values that should use design tokens
 */

const ALLOWED_ZERO_VALUES = ['0', '0px', '0%', '0em', '0rem'];
const ALLOWED_PERCENTAGES = /^(100%|50%|0%)$/;
const ALLOWED_VIEWPORT_UNITS = /^(100vh|100vw|90vh)$/;

// Design tokens that are allowed
const DESIGN_TOKENS = [
  '--color-',
  '--spacing-',
  '--font-',
  '--border-radius-',
  '--shadow-',
  '--transition-',
  '--container-',
  '--section-spacing-',
];

/**
 * Check if a value uses a design token
 */
function usesDesignToken(value) {
  if (!value) return false;
  const valueStr = String(value).trim();
  
  // Check if it's a CSS variable
  if (valueStr.includes('var(--')) {
    return true;
  }
  
  return false;
}

/**
 * Check if a value is an allowed exception
 */
function isAllowedException(value) {
  if (!value) return false;
  const valueStr = String(value).trim();
  
  // Allow 0 values
  if (ALLOWED_ZERO_VALUES.includes(valueStr)) {
    return true;
  }
  
  // Allow specific percentages
  if (ALLOWED_PERCENTAGES.test(valueStr)) {
    return true;
  }
  
  // Allow viewport units
  if (ALLOWED_VIEWPORT_UNITS.test(valueStr)) {
    return true;
  }
  
  // Allow calc() with tokens
  if (valueStr.includes('calc(') && valueStr.includes('var(--')) {
    return true;
  }
  
  // Allow inherit, auto, none, transparent
  if (['inherit', 'auto', 'none', 'transparent', 'currentColor'].includes(valueStr)) {
    return true;
  }
  
  return false;
}

/**
 * Check if a CSS property should use tokens
 */
function shouldUseToken(property) {
  const colorProps = ['color', 'background', 'background-color', 'border-color', 'fill', 'stroke'];
  const spacingProps = ['padding', 'margin', 'gap', 'top', 'left', 'right', 'bottom'];
  const shadowProps = ['box-shadow', 'text-shadow'];
  const fontProps = ['font-family', 'font-weight'];
  const borderProps = ['border-radius'];
  const transitionProps = ['transition'];
  
  return (
    colorProps.some(p => property.includes(p)) ||
    spacingProps.some(p => property.includes(p)) ||
    shadowProps.some(p => property.includes(p)) ||
    fontProps.some(p => property.includes(p)) ||
    borderProps.some(p => property.includes(p)) ||
    transitionProps.some(p => property.includes(p))
  );
}

/**
 * Detect hardcoded color values
 */
function detectHardcodedColor(value) {
  if (!value) return false;
  const valueStr = String(value).trim();
  
  // Hex colors
  if (/#[0-9A-Fa-f]{3,8}/.test(valueStr)) {
    return true;
  }
  
  // RGB/RGBA
  if (/rgba?\(/.test(valueStr)) {
    return true;
  }
  
  // HSL/HSLA
  if (/hsla?\(/.test(valueStr)) {
    return true;
  }
  
  return false;
}

/**
 * Detect hardcoded pixel values
 */
function detectHardcodedPixels(value) {
  if (!value) return false;
  const valueStr = String(value).trim();
  
  // Match pixel values like "16px", "1px", etc.
  // But exclude 0px
  if (/\d+px/.test(valueStr) && !ALLOWED_ZERO_VALUES.includes(valueStr)) {
    return true;
  }
  
  return false;
}

/**
 * Main rule for CSS files
 */
const noCssHardcodedValues = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hardcoded values in CSS that should use design tokens',
      category: 'Design System',
      recommended: true,
    },
    messages: {
      hardcodedColor: 'Hardcoded color "{{value}}" detected. Use a design token like var(--color-*) instead.',
      hardcodedPixels: 'Hardcoded pixel value "{{value}}" detected. Use a spacing token like var(--spacing-*) instead.',
      hardcodedShadow: 'Hardcoded shadow "{{value}}" detected. Use a shadow token like var(--shadow-*) instead.',
      hardcodedFont: 'Hardcoded font "{{value}}" detected. Use a font token like var(--font-*) instead.',
      missingToken: 'Property "{{property}}" with value "{{value}}" should use a design token.',
    },
    schema: [],
  },
  create(context) {
    // This rule is primarily for documentation
    // Actual CSS linting would require a CSS parser
    return {};
  },
};

/**
 * Rule for inline styles in JSX/TSX
 */
const noInlineHardcodedStyles = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hardcoded values in inline styles',
      category: 'Design System',
      recommended: true,
    },
    messages: {
      hardcodedInlineColor: 'Hardcoded color "{{value}}" in inline style. Use a CSS class with design tokens instead.',
      hardcodedInlinePixels: 'Hardcoded pixel value "{{value}}" in inline style. Use a CSS class with design tokens instead.',
      avoidInlineStyles: 'Avoid inline styles. Use CSS classes with design tokens instead.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name.name === 'style' && node.value && node.value.type === 'JSXExpressionContainer') {
          const expression = node.value.expression;
          
          if (expression.type === 'ObjectExpression') {
            expression.properties.forEach(prop => {
              if (prop.type === 'Property' && prop.value) {
                const value = prop.value.type === 'Literal' ? prop.value.value : null;
                
                if (value) {
                  // Check for hardcoded colors
                  if (detectHardcodedColor(value)) {
                    context.report({
                      node: prop.value,
                      messageId: 'hardcodedInlineColor',
                      data: { value: String(value) },
                    });
                  }
                  
                  // Check for hardcoded pixels
                  if (detectHardcodedPixels(value) && !isAllowedException(value)) {
                    context.report({
                      node: prop.value,
                      messageId: 'hardcodedInlinePixels',
                      data: { value: String(value) },
                    });
                  }
                }
              }
            });
          }
        }
      },
    };
  },
};

/**
 * Rule to prefer CSS classes over inline styles
 */
const preferCssClasses = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer CSS classes with design tokens over inline styles',
      category: 'Design System',
      recommended: true,
    },
    messages: {
      preferClass: 'Use CSS classes with design tokens instead of inline styles for better maintainability.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name.name === 'style' && node.value && node.value.type === 'JSXExpressionContainer') {
          const expression = node.value.expression;
          
          // Allow dynamic styles with calculations
          if (expression.type === 'ObjectExpression') {
            const hasDynamicValue = expression.properties.some(prop => {
              return prop.value && prop.value.type !== 'Literal';
            });
            
            // Only warn if all values are static
            if (!hasDynamicValue) {
              context.report({
                node,
                messageId: 'preferClass',
              });
            }
          }
        }
      },
    };
  },
};

export default {
  rules: {
    'no-css-hardcoded-values': noCssHardcodedValues,
    'no-inline-hardcoded-styles': noInlineHardcodedStyles,
    'prefer-css-classes': preferCssClasses,
  },
};


