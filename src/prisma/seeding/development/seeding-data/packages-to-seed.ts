export const packagesToSeed = [
  {
    id: 'acdd99a9-3406-44ba-8ba5-897e3839c5d0',
    name: '2 Tickets for a Taylor Swift concert in Amsterdam',
    description:
      'Attend to a Taylor Swift concert at the Johan Cruyff Arena in Amsterdam',
    appliedDiscountPercentage: 20,
    containedServices: [
      {
        service: {
          id: 'a79fab47-1c70-4eaf-95af-43c0cce4f50f',
        },
        amountContained: 2,
      },
    ],
  },
  {
    id: '4ce0d116-de72-41de-8861-3e3fdfef8b7a',
    name: '2 Tickets for a Beyonce concert in London',
    description: 'Attend to a Beyonce concert at the O2 Arena in London',
    appliedDiscountPercentage: 30,
    containedServices: [
      {
        service: {
          id: '75476841-cb46-4fba-aa84-5825088ea3c8',
        },
        amountContained: 2,
      },
    ],
  },
  {
    id: 'c1d1294c-c19b-4425-ab53-5f0b16a830b0',
    name: '2 British Airways airline tickets to travel from London to New York',
    description: 'Travel from London to New York with British Airways',
    appliedDiscountPercentage: 40,
    containedServices: [
      {
        service: {
          id: '70a53885-5a36-4f2d-b1c7-59c460fadab2',
        },
        amountContained: 2,
      },
    ],
  },
  {
    id: '19866178-cfea-431b-8128-21fb14570b6d',
    name: '2 Tickets for a Coldplay concert in Paris',
    description: 'Attend to a Coldplay concert at the Stade de France in Paris',
    appliedDiscountPercentage: 25,
    containedServices: [
      {
        service: {
          id: '2619fff3-ab86-4e63-9807-c844a4d21b30',
        },
        amountContained: 2,
      },
    ],
  },
  {
    id: '9eae7004-c1ed-4ce3-85be-e05912af496a',
    name: '2 Tickets for a U2 concert in Dublin',
    description: 'Attend to a U2 concert at the Croke Park in Dublin',
    appliedDiscountPercentage: 35,
    containedServices: [
      {
        service: {
          id: 'f279e2f1-d96d-42a0-a683-767d1e34a1f3',
        },
        amountContained: 2,
      },
    ],
  },
];
