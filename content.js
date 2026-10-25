'use strict';
// Illustrative merchant journeys; not a list of shipped capabilities.
const merchantJourneys = {
  "retail": {
    "name": "Shopkeepers & retailers",
    "title": "Keep the shop running. Keep the details organised.",
    "benefit": "A clearer view of the details behind everyday retail work.",
    "steps": [
      "Review a product",
      "Keep the details current",
      "Answer with more confidence"
    ],
    "descriptions": [
      "Choose a product, such as a charging cable, and review its name and description.",
      "Maintain its price and relevant stock information. A person still needs to check that the record is correct.",
      "Use the maintained record as a starting point when a customer asks about it."
    ],
    "records": [
      "Product information",
      "Price & stock notes",
      "A customer enquiry"
    ]
  },
  "wholesale": {
    "name": "Wholesalers & distributors",
    "title": "Bring order to a business built around volume.",
    "benefit": "A more systematic foundation for product records and coordination.",
    "steps": [
      "Organise the catalogue",
      "Record the order details",
      "Follow up clearly"
    ],
    "descriptions": [
      "Keep consistent names and descriptions for the products you supply.",
      "Record the relevant items, quantities, and notes for an order.",
      "Use the record to understand the next follow-up, without relying on separate messages."
    ],
    "records": [
      "A product catalogue",
      "An order record",
      "A follow-up note"
    ]
  },
  "workshop": {
    "name": "Small manufacturers",
    "title": "Make what you create easier to organise.",
    "benefit": "A clearer foundation for running and presenting a small workshop.",
    "steps": [
      "Describe what you make",
      "Keep the specifications",
      "Review the customer request"
    ],
    "descriptions": [
      "Give a finished product a clear description that the team can understand.",
      "Maintain relevant sizes, materials, and product notes in an organised record.",
      "Refer to those details when reviewing an enquiry or order. This illustration does not imply production automation."
    ],
    "records": [
      "A finished product",
      "Its specifications",
      "An enquiry"
    ]
  },
  "service": {
    "name": "Service providers",
    "title": "Organise the work behind the service.",
    "benefit": "Better-organised information behind a service people rely on.",
    "steps": [
      "Describe the service",
      "Keep the job notes",
      "See the next step"
    ],
    "descriptions": [
      "Maintain clear information about the service your business provides.",
      "Keep the useful details of a customer request close to its job record.",
      "Review what needs checking or following up. Automatic booking and dispatch are not being promised."
    ],
    "records": [
      "Service information",
      "A customer request",
      "A job follow-up"
    ]
  },
  "vendor": {
    "name": "Street vendors & hawkers",
    "title": "A small business belongs in the digital future.",
    "benefit": "A practical starting point for records and potential digital visibility.",
    "steps": [
      "Start with what you offer",
      "Keep useful details",
      "Explore suitable discovery"
    ],
    "descriptions": [
      "Create a simple record of the products your business offers.",
      "Keep relevant product and business information accurate as things change.",
      "Where onboarding and authorised discovery are supported, eligible information could help a customer find the business."
    ],
    "records": [
      "Products offered",
      "Business details",
      "Eligible information"
    ]
  },
  "growth": {
    "name": "Small & growing businesses",
    "title": "Build useful habits as the business grows.",
    "benefit": "A stronger foundation without losing sight of the daily work.",
    "steps": [
      "Choose one recurring need",
      "Organise the essentials",
      "Build a repeatable habit"
    ],
    "descriptions": [
      "Start with a question that comes up often, such as which orders need attention.",
      "Bring the relevant details into an organised record.",
      "Decide who checks and updates those details. Add more structure as it becomes useful."
    ],
    "records": [
      "A recurring task",
      "The relevant records",
      "A useful routine"
    ]
  }
};
