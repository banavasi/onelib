# Storybook & Peer Deps Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Set up Storybook 10 with full-showcase stories for all 8 ported components, and add peer dependency auto-install to the scaffold/update pipeline.

**Architecture:** Storybook 10 lives in `apps/storybook/` with CSF Next format. Stories are colocated next to component source files. The scaffold function returns peer deps data, and the CLI handles installation. Two independent workstreams (7a: Storybook, 7b: peer deps) that can be committed separately.

**Tech Stack:** Storybook 10.x, @storybook/react-vite, @storybook/addon-themes, TailwindCSS v4, @tailwindcss/vite, Vitest 4.x

---

## Task 1: Install Storybook 10 dependencies in apps/storybook

**Files:**
- Modify: `apps/storybook/package.json`

**Step 1: Update package.json with all dependencies**

Replace `apps/storybook/package.json` with:

```json
{
  "name": "@onelib/storybook",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "storybook dev -p 6006",
    "build": "storybook build",
    "lint": "biome check .",
    "format": "biome check --write .",
    "clean": "rm -rf storybook-static .turbo node_modules"
  },
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.3.0",
    "motion": "^12.12.1",
    "ogl": "^1.0.11",
    "three": "^0.175.0",
    "@react-three/fiber": "^9.1.2",
    "@use-gesture/react": "^10.3.1"
  },
  "devDependencies": {
    "storybook": "^10.0.0",
    "@storybook/react-vite": "^10.0.0",
    "@storybook/addon-themes": "^10.0.0",
    "@types/react": "^19.1.0",
    "@types/react-dom": "^19.1.0",
    "tailwindcss": "^4.1.0",
    "@tailwindcss/vite": "^4.1.0",
    "typescript": "^5.9.3"
  }
}
```

**Step 2: Run pnpm install from monorepo root**

Run: `pnpm install`
Expected: Dependencies installed, lockfile updated.

**Step 3: Commit**

```
chore(storybook): add Storybook 10 and component peer dependencies
```

---

## Task 2: Create Storybook configuration files

**Files:**
- Create: `apps/storybook/.storybook/main.ts`
- Create: `apps/storybook/.storybook/preview.ts`
- Create: `apps/storybook/.storybook/tailwind.css`
- Create: `apps/storybook/tsconfig.json`

**Step 1: Create `.storybook/main.ts`**

```ts
import { dirname, join } from "node:path";
import { defineMain } from "@storybook/react-vite/node";
import tailwindcss from "@tailwindcss/vite";

function getAbsolutePath(value: string): string {
	return dirname(require.resolve(join(value, "package.json")));
}

export default defineMain({
	framework: "@storybook/react-vite",
	stories: ["../../../packages/components/src/**/*.stories.tsx"],
	addons: [getAbsolutePath("@storybook/addon-themes")],
	viteFinal: async (config) => {
		if (config.resolve) {
			config.resolve.alias = {
				...config.resolve.alias,
				"@/": join(process.cwd(), "../../packages/components/src/"),
			};
		}
		config.plugins = config.plugins || [];
		config.plugins.push(tailwindcss());
		return config;
	},
});
```

**Step 2: Create `.storybook/preview.ts`**

```ts
import type { Preview } from "@storybook/react-vite";
import "./tailwind.css";

const preview: Preview = {
	parameters: {
		backgrounds: { disable: true },
		layout: "centered",
	},
	decorators: [
		(Story, context) => {
			const theme = context.globals["theme"] || "dark";
			return (
				<div className={theme === "dark" ? "dark" : ""}>
					<div className="min-h-screen bg-white dark:bg-gray-950 p-8 text-gray-900 dark:text-gray-100">
						<Story />
					</div>
				</div>
			);
		},
	],
	globalTypes: {
		theme: {
			description: "Global theme for components",
			toolbar: {
				title: "Theme",
				icon: "circlehollow",
				items: [
					{ value: "light", icon: "sun", title: "Light" },
					{ value: "dark", icon: "moon", title: "Dark" },
				],
				dynamicTitle: true,
			},
		},
	},
	initialGlobals: {
		theme: "dark",
	},
};

export default preview;
```

**Step 3: Create `.storybook/tailwind.css`**

```css
@import "tailwindcss";
@source "../../../packages/components/src/**/*.tsx";
```

**Step 4: Create `apps/storybook/tsconfig.json`**

```json
{
	"compilerOptions": {
		"target": "ES2022",
		"module": "ESNext",
		"moduleResolution": "bundler",
		"jsx": "react-jsx",
		"strict": true,
		"esModuleInterop": true,
		"skipLibCheck": true,
		"paths": {
			"@/*": ["../../packages/components/src/*"]
		}
	},
	"include": [
		".storybook/**/*.ts",
		".storybook/**/*.tsx",
		"../../packages/components/src/**/*.stories.tsx"
	]
}
```

**Step 5: Verify storybook starts**

Run from `apps/storybook/`: `pnpm dev`
Expected: Storybook starts on port 6006, shows empty UI (no stories yet).
Press Ctrl+C to stop.

**Step 6: Commit**

```
feat(storybook): add Storybook 10 config with Tailwind and dark mode
```

---

## Task 3: Write basic-button stories

**Files:**
- Create: `packages/components/src/buttons/basic-button/basic-button.stories.tsx`

**Step 1: Write the story file**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BasicButton } from "./basic-button";

/**
 * A versatile button component with multiple variants, sizes, ripple click effect,
 * loading state, and icon support. Source: Sera UI.
 */
const meta = {
	title: "Buttons/Basic Button",
	component: BasicButton,
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
			description: "Visual style variant",
		},
		size: {
			control: "select",
			options: ["default", "sm", "lg"],
			description: "Button size",
		},
		loading: {
			control: "boolean",
			description: "Shows loading spinner and disables interaction",
		},
		disabled: {
			control: "boolean",
			description: "Disables the button",
		},
		children: {
			control: "text",
			description: "Button label text",
		},
	},
	args: {
		children: "Click me",
		variant: "default",
		size: "default",
	},
} satisfies Meta<typeof BasicButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default button with primary styling and ripple effect on click. */
export const Default: Story = {};

/** All six visual variants displayed together. */
export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-4">
			<BasicButton variant="default">Default</BasicButton>
			<BasicButton variant="destructive">Destructive</BasicButton>
			<BasicButton variant="outline">Outline</BasicButton>
			<BasicButton variant="secondary">Secondary</BasicButton>
			<BasicButton variant="ghost">Ghost</BasicButton>
			<BasicButton variant="link">Link</BasicButton>
		</div>
	),
};

/** Three sizes: small, default, and large. */
export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<BasicButton size="sm">Small</BasicButton>
			<BasicButton size="default">Default</BasicButton>
			<BasicButton size="lg">Large</BasicButton>
		</div>
	),
};

/** Loading state disables interaction and shows a spinner. */
export const Loading: Story = {
	args: {
		loading: true,
		children: "Saving...",
	},
};

/** Buttons with leading and trailing icons. */
export const WithIcons: Story = {
	render: () => {
		const PlusIcon = () => (
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
				<path d="M12 5v14M5 12h14" />
			</svg>
		);
		const ArrowIcon = () => (
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
				<path d="M5 12h14M12 5l7 7-7 7" />
			</svg>
		);

		return (
			<div className="flex items-center gap-4">
				<BasicButton iconLeft={<PlusIcon />}>Add Item</BasicButton>
				<BasicButton iconRight={<ArrowIcon />}>Continue</BasicButton>
				<BasicButton iconLeft={<PlusIcon />} iconRight={<ArrowIcon />}>Both</BasicButton>
			</div>
		);
	},
};

/** Icon-only buttons with no text children. */
export const IconOnly: Story = {
	render: () => {
		const HeartIcon = () => (
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
				<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
			</svg>
		);

		return (
			<div className="flex items-center gap-4">
				<BasicButton size="sm" iconLeft={<HeartIcon />} />
				<BasicButton size="default" iconLeft={<HeartIcon />} />
				<BasicButton size="lg" iconLeft={<HeartIcon />} />
			</div>
		);
	},
};
```

**Step 2: Verify in Storybook**

Run from `apps/storybook/`: `pnpm dev`
Expected: "Buttons / Basic Button" appears in sidebar with Default, AllVariants, Sizes, Loading, WithIcons, IconOnly stories. Controls panel works for Default story.

**Step 3: Commit**

```
feat(stories): add full-showcase basic-button stories
```

---

## Task 4: Write shimmer-button stories

**Files:**
- Create: `packages/components/src/buttons/shimmer-button/shimmer-button.stories.tsx`

**Step 1: Write the story file**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ShimmerButton } from "./shimmer-button";

/**
 * A button with an animated conic-gradient shimmer border effect.
 * The shimmer continuously rotates around the button edge. Source: Sera UI.
 */
const meta = {
	title: "Buttons/Shimmer Button",
	component: ShimmerButton,
	tags: ["autodocs"],
	argTypes: {
		children: {
			control: "text",
			description: "Button label text",
		},
	},
	args: {
		children: "Shimmer Button",
	},
} satisfies Meta<typeof ShimmerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default shimmer button with rotating conic gradient border. */
export const Default: Story = {};

/** Shimmer button with custom text content. */
export const CustomText: Story = {
	args: {
		children: "Get Started Free",
	},
};

/** Multiple shimmer buttons shown together. */
export const Group: Story = {
	render: () => (
		<div className="flex flex-col items-center gap-6">
			<ShimmerButton>Sign Up Now</ShimmerButton>
			<ShimmerButton>Learn More</ShimmerButton>
			<ShimmerButton>Contact Sales</ShimmerButton>
		</div>
	),
};
```

**Step 2: Verify in Storybook**

Expected: "Buttons / Shimmer Button" in sidebar with animated border effect visible.

**Step 3: Commit**

```
feat(stories): add shimmer-button stories
```

---

## Task 5: Write fuzzy-text stories

**Files:**
- Create: `packages/components/src/text-animations/fuzzy-text/fuzzy-text.stories.tsx`

**Step 1: Write the story file**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FuzzyText } from "./fuzzy-text";

/**
 * Canvas-based text with a fuzzy glitch displacement effect on hover.
 * Rows of pixels shift randomly creating a static/glitch appearance.
 * Intensity increases on mouse hover. Source: Sera UI.
 */
const meta = {
	title: "Text Animations/Fuzzy Text",
	component: FuzzyText,
	tags: ["autodocs"],
	argTypes: {
		text: {
			control: "text",
			description: "The text to display",
		},
		fontSize: {
			control: "text",
			description: "CSS font size value",
		},
		fontWeight: {
			control: { type: "number", min: 100, max: 900, step: 100 },
			description: "Font weight (100-900)",
		},
		color: {
			control: "color",
			description: "Text color (hex)",
		},
		baseIntensity: {
			control: { type: "number", min: 0, max: 20, step: 0.5 },
			description: "Glitch intensity at rest",
		},
		hoverIntensity: {
			control: { type: "number", min: 0, max: 50, step: 1 },
			description: "Glitch intensity on hover",
		},
	},
	args: {
		text: "HOVER ME",
		fontSize: "clamp(3rem, 10vw, 8rem)",
		fontWeight: 700,
		color: "#33ffcc",
		baseIntensity: 1,
		hoverIntensity: 15,
	},
	decorators: [
		(Story) => (
			<div className="w-full flex items-center justify-center p-8">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof FuzzyText>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default fuzzy text — hover to see increased glitch intensity. */
export const Default: Story = {};

/** Custom yellow color with high base intensity for always-on glitch. */
export const CustomColor: Story = {
	args: {
		text: "GLITCH",
		color: "#D7D00F",
		baseIntensity: 6,
		hoverIntensity: 20,
	},
};

/** Maximum intensity — chaotic displacement at all times. */
export const HighIntensity: Story = {
	args: {
		text: "CHAOS",
		color: "#ff3366",
		baseIntensity: 15,
		hoverIntensity: 40,
	},
};

/** Subtle effect with low base and hover intensities. */
export const Subtle: Story = {
	args: {
		text: "SUBTLE",
		color: "#6699ff",
		baseIntensity: 0.5,
		hoverIntensity: 5,
	},
};
```

**Step 2: Verify in Storybook**

Expected: "Text Animations / Fuzzy Text" — canvas renders text, hovering shows displacement effect. Controls change text, color, and intensity in real-time.

**Step 3: Commit**

```
feat(stories): add fuzzy-text stories with interactive controls
```

---

## Task 6: Write decrypting-text stories

**Files:**
- Create: `packages/components/src/text-animations/decrypting-text/decrypting-text.stories.tsx`

**Step 1: Write the story file**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DecryptingText } from "./decrypting-text";

/**
 * Text reveal animation that scrambles characters before decoding to the target text.
 * Characters cycle through random symbols before settling into final positions.
 * Uses motion for fade-in opacity animation. Source: Sera UI.
 */
const meta = {
	title: "Text Animations/Decrypting Text",
	component: DecryptingText,
	tags: ["autodocs"],
	argTypes: {
		targetText: {
			control: "text",
			description: "The text to reveal through decryption animation",
		},
		speed: {
			control: { type: "number", min: 1, max: 20, step: 1 },
			description: "Decryption speed (higher = slower reveal)",
		},
		className: {
			control: "text",
			description: "Custom CSS class for styling",
		},
	},
	args: {
		targetText: "In silence wakes the sleeping code",
		speed: 8,
	},
	decorators: [
		(Story) => (
			<div className="w-full flex items-center justify-center p-8 font-mono">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof DecryptingText>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default decryption animation — characters scramble then reveal. */
export const Default: Story = {};

/** Slow decryption with reduced speed for dramatic reveal. */
export const SlowDecode: Story = {
	args: {
		targetText: "A whisper through the circuit flowed",
		speed: 3,
	},
};

/** Fast decryption that resolves almost instantly. */
export const FastDecode: Story = {
	args: {
		targetText: "Decrypted in a flash",
		speed: 15,
	},
};

/** Custom styled text with a different CSS class. */
export const CustomStyle: Story = {
	args: {
		targetText: "Custom styling applied",
		className: "text-4xl font-bold text-center text-cyan-400",
	},
};

/** Multiple lines displayed together (re-mount to replay animation). */
export const MultiLine: Story = {
	render: () => (
		<div className="flex flex-col items-center gap-2">
			<DecryptingText targetText="First line decrypting..." speed={3} />
			<DecryptingText targetText="Second line follows behind" speed={3} />
			<DecryptingText targetText="Third line arrives last" speed={3} />
		</div>
	),
};
```

**Step 2: Verify in Storybook**

Expected: "Text Animations / Decrypting Text" — text scrambles on mount, resolves to target. Changing args triggers re-render with new animation.

**Step 3: Commit**

```
feat(stories): add decrypting-text stories
```

---

## Task 7: Write marquee stories

**Files:**
- Create: `packages/components/src/sections/marquee/marquee.stories.tsx`

**Step 1: Write the story file**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Marquee } from "./marquee";

/**
 * Smooth infinite scrolling marquee with configurable speed, direction,
 * pause-on-hover, and vertical orientation support.
 * Content is repeated for seamless looping. Source: Sera UI.
 */
const meta = {
	title: "Sections/Marquee",
	component: Marquee,
	tags: ["autodocs"],
	argTypes: {
		speed: {
			control: { type: "number", min: 10, max: 200, step: 10 },
			description: "Scroll speed in pixels per second",
		},
		reverse: {
			control: "boolean",
			description: "Reverse the scroll direction",
		},
		pauseOnHover: {
			control: "boolean",
			description: "Pause scrolling when hovered",
		},
		vertical: {
			control: "boolean",
			description: "Scroll vertically instead of horizontally",
		},
		repeat: {
			control: { type: "number", min: 2, max: 8, step: 1 },
			description: "Number of times to repeat the content for seamless looping",
		},
	},
	args: {
		speed: 50,
		reverse: false,
		pauseOnHover: false,
		vertical: false,
		repeat: 4,
	},
	decorators: [
		(Story) => (
			<div className="w-full max-w-3xl overflow-hidden">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Marquee>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleCards = () => (
	<>
		{["React", "TypeScript", "Tailwind", "Vite", "Storybook"].map((tech) => (
			<div
				key={tech}
				className="flex items-center justify-center px-6 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm font-medium whitespace-nowrap"
			>
				{tech}
			</div>
		))}
	</>
);

/** Default horizontal marquee scrolling left. */
export const Default: Story = {
	render: (args) => (
		<Marquee {...args}>
			<SampleCards />
		</Marquee>
	),
};

/** Marquee scrolling in reverse (right-to-left becomes left-to-right). */
export const Reversed: Story = {
	render: (args) => (
		<Marquee {...args}>
			<SampleCards />
		</Marquee>
	),
	args: {
		reverse: true,
	},
};

/** Vertical scrolling marquee. */
export const Vertical: Story = {
	render: (args) => (
		<Marquee {...args}>
			<SampleCards />
		</Marquee>
	),
	args: {
		vertical: true,
	},
	decorators: [
		(Story) => (
			<div className="h-[300px] overflow-hidden">
				<Story />
			</div>
		),
	],
};

/** Hover to pause the scrolling animation. */
export const PauseOnHover: Story = {
	render: (args) => (
		<Marquee {...args}>
			<SampleCards />
		</Marquee>
	),
	args: {
		pauseOnHover: true,
		speed: 80,
	},
};

/** Double-row marquee with opposing directions. */
export const DoubleRow: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<Marquee speed={60}>
				<SampleCards />
			</Marquee>
			<Marquee speed={60} reverse>
				<SampleCards />
			</Marquee>
		</div>
	),
};
```

**Step 2: Verify in Storybook**

Expected: "Sections / Marquee" — smooth infinite scroll, pause-on-hover works, vertical variant scrolls vertically.

**Step 3: Commit**

```
feat(stories): add marquee stories with all direction variants
```

---

## Task 8: Write aurora background stories

**Files:**
- Create: `packages/components/src/backgrounds/aurora/aurora.stories.tsx`

**Step 1: Write the story file**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import Aurora from "./aurora";

/**
 * Animated aurora borealis background effect using WebGL shaders via OGL.
 * Renders simplex noise-driven color gradients with customizable color stops,
 * amplitude, blend, and speed. Requires `ogl` peer dependency. Source: ReactBits.
 */
const meta = {
	title: "Backgrounds/Aurora",
	component: Aurora,
	tags: ["autodocs"],
	argTypes: {
		colorStops: {
			control: "object",
			description: "Array of 3 hex color strings for the gradient stops",
		},
		amplitude: {
			control: { type: "number", min: 0.1, max: 3, step: 0.1 },
			description: "Height/intensity of the aurora waves",
		},
		blend: {
			control: { type: "number", min: 0, max: 1, step: 0.05 },
			description: "Edge softness of the aurora (0 = hard, 1 = very soft)",
		},
		speed: {
			control: { type: "number", min: 0.1, max: 5, step: 0.1 },
			description: "Animation speed multiplier",
		},
	},
	args: {
		colorStops: ["#5227FF", "#7cff67", "#5227FF"],
		amplitude: 1.0,
		blend: 0.5,
		speed: 1.0,
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[500px] relative rounded-lg overflow-hidden bg-black">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Aurora>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default purple-green aurora with medium amplitude. */
export const Default: Story = {};

/** Warm color palette with orange and red tones. */
export const WarmColors: Story = {
	args: {
		colorStops: ["#FF6B35", "#FFD700", "#FF1493"],
	},
};

/** Cool blue-cyan palette. */
export const CoolColors: Story = {
	args: {
		colorStops: ["#00BFFF", "#1E90FF", "#0000CD"],
	},
};

/** High amplitude creates dramatic, tall waves. */
export const HighAmplitude: Story = {
	args: {
		amplitude: 2.5,
		blend: 0.3,
	},
};

/** Slow, gentle aurora movement. */
export const SlowSpeed: Story = {
	args: {
		speed: 0.3,
		amplitude: 0.8,
	},
};
```

**Step 2: Verify in Storybook**

Expected: "Backgrounds / Aurora" — WebGL canvas renders aurora effect. Color picker controls work. Note: requires WebGL support in browser.

**Step 3: Commit**

```
feat(stories): add aurora background stories with WebGL shader controls
```

---

## Task 9: Write silk background stories

**Files:**
- Create: `packages/components/src/backgrounds/silk/silk.stories.tsx`

**Step 1: Write the story file**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Silk } from "./silk";

/**
 * Animated silk fabric background effect using Three.js GLSL shaders.
 * Renders flowing, organic patterns with customizable color, speed, scale,
 * noise, and rotation. Requires `three` and `@react-three/fiber`. Source: ReactBits.
 */
const meta = {
	title: "Backgrounds/Silk",
	component: Silk,
	tags: ["autodocs"],
	argTypes: {
		speed: {
			control: { type: "number", min: 0.5, max: 20, step: 0.5 },
			description: "Animation speed of the silk flow",
		},
		scale: {
			control: { type: "number", min: 0.5, max: 5, step: 0.1 },
			description: "Scale of the pattern texture",
		},
		color: {
			control: "color",
			description: "Base color of the silk pattern (hex)",
		},
		noiseIntensity: {
			control: { type: "number", min: 0, max: 5, step: 0.1 },
			description: "Intensity of the noise grain overlay",
		},
		rotation: {
			control: { type: "number", min: 0, max: 6.28, step: 0.1 },
			description: "Rotation angle of the pattern in radians",
		},
	},
	args: {
		speed: 5,
		scale: 1,
		color: "#7B7481",
		noiseIntensity: 1.5,
		rotation: 0,
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[500px] relative rounded-lg overflow-hidden">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Silk>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default grey-purple silk pattern with moderate speed. */
export const Default: Story = {};

/** Deep blue silk with high speed. */
export const OceanSilk: Story = {
	args: {
		color: "#1a237e",
		speed: 10,
		noiseIntensity: 0.5,
	},
};

/** Warm golden silk with low noise for a cleaner look. */
export const GoldenSilk: Story = {
	args: {
		color: "#b8860b",
		speed: 3,
		noiseIntensity: 0.3,
		scale: 1.5,
	},
};

/** Rotated pattern creating diagonal flow. */
export const DiagonalFlow: Story = {
	args: {
		rotation: 0.785,
		speed: 7,
		color: "#4a148c",
	},
};

/** High scale zoomed-in pattern revealing fine detail. */
export const ZoomedIn: Story = {
	args: {
		scale: 3,
		speed: 2,
		noiseIntensity: 2,
	},
};
```

**Step 2: Verify in Storybook**

Expected: "Backgrounds / Silk" — Three.js canvas renders silk pattern. Color and speed controls work.

**Step 3: Commit**

```
feat(stories): add silk background stories with Three.js shader controls
```

---

## Task 10: Write dome-gallery stories

**Files:**
- Create: `packages/components/src/gallery/dome-gallery/dome-gallery.stories.tsx`

First, read the DomeGallery props interface to understand the API.

The dome-gallery component renders images on a 3D sphere. We need to check its props interface.

**Step 1: Write the story file**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import DomeGallery from "./dome-gallery";

/**
 * Interactive 3D spherical image gallery with drag navigation and click-to-enlarge.
 * Images are mapped onto a dome surface that responds to mouse/touch drag gestures.
 * Requires `@use-gesture/react` peer dependency. Source: ReactBits.
 */
const meta = {
	title: "Gallery/Dome Gallery",
	component: DomeGallery,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="w-full h-[600px] relative rounded-lg overflow-hidden bg-black">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof DomeGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleImages = Array.from({ length: 12 }, (_, i) => ({
	src: `https://picsum.photos/seed/${i + 1}/400/300`,
	alt: `Sample image ${i + 1}`,
}));

/** Default dome gallery with 12 placeholder images. Drag to rotate, click to enlarge. */
export const Default: Story = {
	args: {
		images: sampleImages,
	},
};

/** Gallery with fewer images showing more spacing on the dome. */
export const FewImages: Story = {
	args: {
		images: sampleImages.slice(0, 6),
	},
};
```

Note: The exact props shape depends on the DomeGallery component's interface. We'll need to read the full file to determine the correct prop names. The story file above will be adjusted during implementation based on the actual API discovered by reading the full `dome-gallery.tsx`.

**Step 2: Verify in Storybook**

Expected: "Gallery / Dome Gallery" — 3D sphere with images, drag rotates, click enlarges.

**Step 3: Commit**

```
feat(stories): add dome-gallery stories
```

---

## Task 11: Add ScaffoldResult return type to scaffoldComponents

**Files:**
- Modify: `packages/components/src/scaffold.ts`
- Modify: `packages/components/src/index.ts`
- Modify: `packages/components/src/__tests__/scaffold.test.ts`

**Step 1: Write the failing test**

Add to `packages/components/src/__tests__/scaffold.test.ts`:

```ts
it("returns ScaffoldResult with component count and peer dependencies", () => {
	// Create a registry.json in the source dir
	const registry = {
		version: "0.1.0",
		components: [
			{
				name: "aurora",
				displayName: "Aurora",
				category: "backgrounds",
				source: "reactbits",
				sourceUrl: "https://reactbits.dev/backgrounds/aurora",
				version: "0.1.0",
				description: "Aurora",
				files: ["backgrounds/aurora/aurora.tsx"],
				peerDependencies: { ogl: "^1.0.0" },
				dependencies: [],
				tags: ["background"],
			},
			{
				name: "basic-button",
				displayName: "Basic Button",
				category: "buttons",
				source: "seraui",
				sourceUrl: "https://seraui.com/docs/buttons/basic",
				version: "0.1.0",
				description: "Button",
				files: ["buttons/basic-button/basic-button.tsx"],
				dependencies: [],
				tags: ["button"],
			},
		],
	};
	writeFileSync(join(COMPONENTS_SRC, "registry.json"), JSON.stringify(registry));

	const result = scaffoldComponents(COMPONENTS_SRC, TARGET_DIR);

	expect(result.componentsInstalled).toBeGreaterThanOrEqual(2);
	expect(result.peerDependencies).toEqual({ ogl: "^1.0.0" });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/__tests__/scaffold.test.ts` in `packages/components/`
Expected: FAIL — `scaffoldComponents` returns `void`, not an object.

**Step 3: Modify scaffold.ts to return ScaffoldResult**

In `packages/components/src/scaffold.ts`, add the `ScaffoldResult` interface and change the return type:

```ts
export interface ScaffoldResult {
	componentsInstalled: number;
	peerDependencies: Record<string, string>;
}
```

Change `scaffoldComponents` to:
1. Return type: `ScaffoldResult` instead of `void`
2. After copying, check if `registry.json` exists in `sourceDir`
3. If it does, parse it, match scaffolded components by name, collect peerDependencies
4. Return `{ componentsInstalled, peerDependencies }`

**Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/__tests__/scaffold.test.ts` in `packages/components/`
Expected: ALL tests PASS (old tests still pass since they don't check return value).

**Step 5: Export ScaffoldResult from index.ts**

Add to `packages/components/src/index.ts`:
```ts
export type { ComponentsLock, LockEntry, ScaffoldResult } from "./scaffold.js";
```

**Step 6: Commit**

```
feat(components): return ScaffoldResult with peer deps from scaffoldComponents
```

---

## Task 12: Add peerDependencies to UpdateReport

**Files:**
- Modify: `packages/components/src/updater.ts`
- Modify: `packages/components/src/__tests__/updater.test.ts`

**Step 1: Write the failing test**

Add to `packages/components/src/__tests__/updater.test.ts`:

```ts
it("collects peer dependencies from newly added components", () => {
	// Setup: source has a component with peerDependencies in registry.json
	mkdirSync(join(SOURCE_DIR, "backgrounds/aurora"), { recursive: true });
	writeFileSync(
		join(SOURCE_DIR, "backgrounds/aurora/aurora.tsx"),
		"export function Aurora() { return <div />; }",
	);

	const registry = {
		version: "0.1.0",
		components: [
			{
				name: "aurora",
				displayName: "Aurora",
				category: "backgrounds",
				source: "reactbits",
				sourceUrl: "https://reactbits.dev/backgrounds/aurora",
				version: "0.1.0",
				description: "Aurora",
				files: ["backgrounds/aurora/aurora.tsx"],
				peerDependencies: { ogl: "^1.0.0" },
				dependencies: [],
				tags: ["background"],
			},
		],
	};
	writeFileSync(join(SOURCE_DIR, "registry.json"), JSON.stringify(registry));

	mkdirSync(join(COMPONENTS_DIR), { recursive: true });
	const lock: ComponentsLock = { version: "0.1.0", components: {} };
	mkdirSync(join(PROJECT_DIR, ".onelib"), { recursive: true });
	writeFileSync(LOCK_PATH, JSON.stringify(lock), "utf-8");

	const report = updateComponents(SOURCE_DIR, PROJECT_DIR);

	expect(report.added).toContain("aurora");
	expect(report.peerDependencies).toEqual({ ogl: "^1.0.0" });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/__tests__/updater.test.ts` in `packages/components/`
Expected: FAIL — `report.peerDependencies` is undefined.

**Step 3: Add peerDependencies to UpdateReport and updater logic**

In `packages/components/src/updater.ts`:
1. Add `peerDependencies: Record<string, string>` to `UpdateReport`
2. After the loop, if `registry.json` exists in `sourceDir`, parse it
3. For components in `report.added` or `report.updated`, collect their peerDependencies
4. Return merged peerDependencies in the report

**Step 4: Run tests**

Run: `pnpm vitest run src/__tests__/updater.test.ts` in `packages/components/`
Expected: ALL PASS

**Step 5: Commit**

```
feat(components): add peerDependencies to UpdateReport
```

---

## Task 13: Wire peer dep install into create-onelib scaffold

**Files:**
- Modify: `packages/create-onelib/src/utils/scaffold.ts`
- Modify: `packages/create-onelib/src/__tests__/integration/scaffold.test.ts`

**Step 1: Write the failing test**

Add to `packages/create-onelib/src/__tests__/integration/scaffold.test.ts`:

```ts
it("scaffoldProject returns peer dependencies from components", async () => {
	const projectDir = path.join(tmpDir, "my-project");
	const result = await scaffoldProject(projectDir, "my-project");

	expect(result).toBeDefined();
	expect(result.peerDependencies).toBeDefined();
	expect(typeof result.peerDependencies).toBe("object");
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/__tests__/integration/scaffold.test.ts` in `packages/create-onelib/`
Expected: FAIL — `scaffoldProject` returns `void`.

**Step 3: Update scaffoldProject to return peer deps**

In `packages/create-onelib/src/utils/scaffold.ts`, change return type from `Promise<void>` to `Promise<ScaffoldProjectResult>`:

```ts
import { type ScaffoldResult, scaffoldComponents } from "@onelib/components";

export interface ScaffoldProjectResult {
	peerDependencies: Record<string, string>;
}

export async function scaffoldProject(
	projectDir: string,
	projectName: string,
): Promise<ScaffoldProjectResult> {
	// ... existing code ...

	// Copy component .tsx files into src/components/
	const componentsSourceDir = getComponentsSourcePath();
	const targetComponentsDir = path.join(projectDir, "src/components");
	const scaffoldResult = scaffoldComponents(componentsSourceDir, targetComponentsDir);

	return {
		peerDependencies: scaffoldResult.peerDependencies,
	};
}
```

**Step 4: Run tests**

Run: `pnpm vitest run src/__tests__/integration/scaffold.test.ts` in `packages/create-onelib/`
Expected: ALL PASS

**Step 5: Commit**

```
feat(create-onelib): return peer dependencies from scaffoldProject
```

---

## Task 14: Wire peer dep install into scripts components-update

**Files:**
- Modify: `tooling/scripts/src/commands/components-update.ts`

**Step 1: Update components-update to log new peer deps**

In `tooling/scripts/src/commands/components-update.ts`, after logging the report:

```ts
if (report.peerDependencies && Object.keys(report.peerDependencies).length > 0) {
	const depsList = Object.entries(report.peerDependencies)
		.map(([name, version]) => `${name}@${version}`)
		.join(" ");
	logger.log(`New peer dependencies needed: ${depsList}`);
	logger.log(`Run: pnpm add ${Object.keys(report.peerDependencies).join(" ")}`);
}
```

Note: For the update command (running inside an existing project), we log the deps and suggest the install command rather than auto-running it, since the user may want to review first. The auto-install happens at create-time (in the CLI), not update-time.

**Step 2: Run existing tests**

Run: `pnpm vitest run` in `tooling/scripts/`
Expected: ALL PASS (existing tests still pass; the mock UpdateReport just needs the new field).

**Step 3: Commit**

```
feat(scripts): log new peer dependencies after component update
```

---

## Task 15: Run full test suite and verify build

**Step 1: Run all tests**

Run: `pnpm test` from monorepo root
Expected: All tests pass (157+ tests across 7+ packages).

**Step 2: Run build**

Run: `pnpm build` from monorepo root (note: storybook build may fail if stories have issues)
Expected: All build tasks pass.

**Step 3: Verify storybook dev works**

Run from `apps/storybook/`: `pnpm dev`
Expected: All 8 components visible in sidebar with working stories and controls.

**Step 4: Final commit if any fixups needed**

```
chore: fixup story and peer deps integration
```
