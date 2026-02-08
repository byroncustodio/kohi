#!/usr/bin/env node

/**
 * Component Generator for Kohi
 *
 * Usage: node create-component.js ComponentName [options]
 * Options:
 *   --screen     Create a route screen (in app/)
 *   --hook       Create a custom hook (in hooks/)
 *   --ui         Create a UI primitive (in components/ui/)
 *   --test       Include test file
 *
 * File names are generated in kebab-case.
 * Example: node create-component.js UserCard → components/user-card.tsx
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const componentName = args[0];

if (!componentName) {
    console.error('Error: Component name is required');
    console.log('Usage: node create-component.js ComponentName [--screen] [--hook] [--ui] [--test]');
    process.exit(1);
}

if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
    console.error('Error: Component name must be in PascalCase (e.g., UserCard)');
    process.exit(1);
}

const options = {
    screen: args.includes('--screen'),
    hook: args.includes('--hook'),
    ui: args.includes('--ui'),
    test: args.includes('--test'),
};

// Convert PascalCase to kebab-case
function toKebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();
}

const kebabName = toKebabCase(componentName);
const hookName = `use-${kebabName}`;
const hookFunctionName = `use${componentName}`;

// Determine project root (walk up from script location)
const projectRoot = path.resolve(__dirname, '..', '..', '..');

// Determine output paths
let outputDir;
let fileName;

if (options.hook) {
    outputDir = path.join(projectRoot, 'hooks');
    fileName = hookName;
} else if (options.screen) {
    outputDir = path.join(projectRoot, 'app');
    fileName = kebabName;
} else if (options.ui) {
    outputDir = path.join(projectRoot, 'components', 'ui');
    fileName = kebabName;
} else {
    outputDir = path.join(projectRoot, 'components');
    fileName = kebabName;
}

// Templates

const componentTemplate = `import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

interface ${componentName}Props {
  // Add props here
}

export function ${componentName}({}: ${componentName}Props) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>${componentName}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    // Add styles here
  },
});
`;

const screenTemplate = `import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ${componentName}Screen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">${componentName}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
`;

const hookTemplate = `import { useState, useEffect } from 'react';

interface ${hookFunctionName}Return {
  // Define return type
}

export function ${hookFunctionName}(): ${hookFunctionName}Return {
  // Implement hook

  return {
    // Return values
  };
}
`;

const componentTestTemplate = `import { render } from '@testing-library/react-native';
import { ${componentName} } from '@/components/${fileName}';

describe('${componentName}', () => {
  it('renders correctly', () => {
    const { getByText } = render(<${componentName} />);
    expect(getByText('${componentName}')).toBeTruthy();
  });
});
`;

const hookTestTemplate = `import { renderHook } from '@testing-library/react-native';
import { ${hookFunctionName} } from '@/hooks/${hookName}';

describe('${hookFunctionName}', () => {
  it('works correctly', () => {
    const { result } = renderHook(() => ${hookFunctionName}());
    // Add assertions
  });
});
`;

// Write files
try {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    if (options.hook) {
        const filePath = path.join(outputDir, `${hookName}.ts`);
        fs.writeFileSync(filePath, hookTemplate);
        console.log(`Created hook: ${path.relative(projectRoot, filePath)}`);

        if (options.test) {
            const testDir = path.join(outputDir, '__tests__');
            if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });
            const testPath = path.join(testDir, `${hookName}.test.ts`);
            fs.writeFileSync(testPath, hookTestTemplate);
            console.log(`Created test: ${path.relative(projectRoot, testPath)}`);
        }
    } else if (options.screen) {
        const filePath = path.join(outputDir, `${kebabName}.tsx`);
        fs.writeFileSync(filePath, screenTemplate);
        console.log(`Created screen: ${path.relative(projectRoot, filePath)}`);
        console.log(`Route URL: /${kebabName}`);
        console.log('Remember to add this screen to the relevant _layout.tsx if needed.');
    } else {
        const filePath = path.join(outputDir, `${kebabName}.tsx`);
        fs.writeFileSync(filePath, componentTemplate);
        console.log(`Created component: ${path.relative(projectRoot, filePath)}`);

        if (options.test) {
            const testDir = path.join(outputDir, '__tests__');
            if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });
            const testPath = path.join(testDir, `${kebabName}.test.tsx`);
            fs.writeFileSync(testPath, componentTestTemplate);
            console.log(`Created test: ${path.relative(projectRoot, testPath)}`);
        }
    }

    console.log('Done.');
} catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}
