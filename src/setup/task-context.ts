import { signal } from '@preact/signals-react';
import { TaskBase } from '../task/entity/base';
import { TaskContext } from '../task/entity/context';
import { taskStatuses } from '../task/entity/status';

export const taskContext = new TaskContext({
	name: 'All tasks',
	state: signal([]),
});

const exampleTasks = [
	{ id: 1, text: 'XYZ Product Launch', parentIds: [] },
	{ id: 2, text: 'In-depth Market Research', parentIds: [1] },
	{
		id: 3,
		text: "Analyze Top 5 Competitors' Product Features",
		parentIds: [2],
	},
	{
		id: 4,
		text: 'Identify Niche Market Segments',
		parentIds: [2],
	},
	{ id: 5, text: 'Multichannel Marketing Strategy', parentIds: [1] },
	{ id: 6, text: 'Content Marketing - Blog and Video', parentIds: [5] },
	{
		id: 7,
		text: 'Social Media Marketing - Instagram, Twitter, LinkedIn',
		parentIds: [5],
	},
	{ id: 8, text: 'Email Marketing Campaign', parentIds: [5] },
	{
		id: 9,
		text: 'PR Campaign - Press and Influencer Outreach',
		parentIds: [5],
	},
	{ id: 10, text: 'Design and Branding', parentIds: [1] },
	{ id: 11, text: 'Eco-Friendly Product Packaging Design', parentIds: [10] },
	{
		id: 12,
		text: 'Responsive Website Design',
		parentIds: [10],
	},
	{ id: 13, text: 'XYZ Product Launch Event Planning', parentIds: [1] },
	{ id: 14, text: 'Secure Unique Venue', parentIds: [13] },
	{
		id: 15,
		text: 'Invitations',
		parentIds: [13],
	},
	{
		id: 16,
		text: 'Prepare Engaging Product Presentation',
		parentIds: [13],
	},
	{
		id: 17,
		text: 'Write SEO-Optimized Blog Posts on XYZ Product Features',
		parentIds: [6],
	},
	{
		id: 18,
		text: 'Create 3-Month Social Media Content Calendar',
		parentIds: [7],
	},
	{
		id: 19,
		text: 'Design Email Templates',
		parentIds: [8],
	},
	{
		id: 20,
		text: 'Write and Distribute Press Release',
		parentIds: [9],
	},
	{
		id: 21,
		text: 'Coordinate Product Reviews and Interviews with Key Influencers',
		parentIds: [9],
	},
	{ id: 22, text: 'Personal Tasks', parentIds: [] },
	{
		id: 23,
		text: 'Buy Ingredients',
		parentIds: [22],
	},
	{ id: 24, text: 'Run 5 Miles at Local Park', parentIds: [22] },
	{
		id: 26,
		text: 'Design Custom XYZ Product Launch Event Invitations',
		parentIds: [15, 10],
	},
	{ id: 27, text: 'Deep Clean Living Room Carpet', parentIds: [22] },
	{ id: 28, text: 'Schedule Teeth Cleaning with Dr. Smith', parentIds: [22] },
	{
		id: 29,
		text: 'Call Mom and Dad to Discuss Family Reunion',
		parentIds: [22],
	},
	{ id: 30, text: 'Plan Trip to Yosemite National Park', parentIds: [22] },
	{ id: 31, text: 'Book Airbnb Near Yosemite Valley', parentIds: [30] },
	{ id: 32, text: 'Research and Reserve Guided Hiking Tours', parentIds: [30] },
	{ id: 33, text: 'Create Packing List', parentIds: [30] },
	{ id: 34, text: 'Hobbies', parentIds: [] },
	{ id: 35, text: 'Astrophotography', parentIds: [34] },
	{
		id: 36,
		text: 'Learn Star Stacking Technique in Photoshop',
		parentIds: [35],
	},
	{ id: 37, text: 'Organize and Backup Milky Way Photos', parentIds: [35] },
	{
		id: 38,
		text: 'Plan Night Sky Photoshoot at Dark Sky Park',
		parentIds: [35],
	},
	{ id: 39, text: 'Baking Artisan Bread', parentIds: [34] },
	{ id: 40, text: 'Try New Sourdough Baguette Recipe', parentIds: [39] },
	{ id: 41, text: 'Organize Bread Recipes in Evernote', parentIds: [39] },
	{ id: 43, text: 'Indoor Herb Gardening', parentIds: [34] },
	{ id: 44, text: 'Plant Thai Basil and Cilantro', parentIds: [43] },
	{ id: 45, text: 'Apply Organic Fertilizer to Herb Pots', parentIds: [43] },
	{ id: 46, text: 'Prune and Harvest Mint', parentIds: [43] },
	{ id: 47, text: 'Watercolor Painting', parentIds: [34] },
	{ id: 48, text: 'Learn Wet-on-Wet Technique', parentIds: [47] },
	{
		id: 49,
		text: 'Create Watercolor Painting of Favorite Travel Destination',
		parentIds: [47],
	},
	{ id: 50, text: 'Attend Local Watercolor Exhibit', parentIds: [47] },
	{ id: 57, text: 'Extra Virgin Olive Oil', parentIds: [23] },
	{ id: 58, text: 'Feta Cheese', parentIds: [23] },
	{ id: 59, text: 'Kalamata Olives', parentIds: [23] },
	{ id: 60, text: 'Couscous', parentIds: [23] },
	{ id: 61, text: 'Cherry Tomatoes', parentIds: [23] },
	{ id: 62, text: 'Fresh Basil', parentIds: [23] },
	{ id: 63, text: 'Lemons', parentIds: [23] },
	{ id: 64, text: 'Garlic Cloves', parentIds: [23] },
];

exampleTasks
	.map(
		(exampleTask) =>
			new TaskBase({
				id: `${exampleTask.id}`,
				textState: signal(exampleTask.text),
				parentIdsState: signal(
					new Set(exampleTask.parentIds.map((id) => `${id}`)),
				),
				staticStatusState: signal(
					taskStatuses[Math.floor(taskStatuses.length * Math.random())],
				),
			}),
	)
	.forEach((taskBase) => taskContext.add(taskBase));
