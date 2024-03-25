export const ordersToSeed = [
  {
    id: 'eaf0f0e9-4b12-4b61-99cd-72783b06a235',
    customerId: '1db1dc8c-297c-4b1e-a4f6-405cfa5aa34e',
    salespersonId: '3c941ad8-672d-4dc7-8829-d3b3134cea97',
    orderedPackages: [
      {
        packageId: '9eae7004-c1ed-4ce3-85be-e05912af496a',
        amountOrdered: 1,
      },
    ],
    orderedServices: [],
    placementTimestamp: new Date('2024-03-25T10:00:00-04:00'),
  },
  {
    id: '30f9a0b3-0227-4fd7-b88a-76350eb9b6bd',
    customerId: '30f9a0b3-0227-4fd7-b88a-76350eb9b6bd',
    salespersonId: '667d2db9-ebce-4d81-ad2e-d3ea21faf315',
    orderedPackages: [],
    orderedServices: [
      {
        serviceId: '366dcfab-03ab-402f-88bd-a4903d6ed410',
        amountOrdered: 1,
      },
    ],
    placementTimestamp: new Date('2024-03-25T14:00:00-04:00'),
  },
  {
    id: '54c568e9-34d2-4314-a7b1-74018626a048',
    customerId: '05b65ba4-8a81-40b5-8a18-0306a6ba35d3',
    salespersonId: 'aa66cd98-d500-4fbf-b1c5-007cae151e3a',
    orderedPackages: [
      {
        packageId: 'c1d1294c-c19b-4425-ab53-5f0b16a830b0',
        amountOrdered: 1,
      },
    ],
    orderedServices: [],
    placementTimestamp: new Date('2024-03-24T16:00:00-04:00'),
  },
  {
    id: '6ec83bcc-0c65-40fd-8e3f-a1025d6cc1a5',
    customerId: '5756dad5-a1ee-44e0-82f6-8e7746d29f7c',
    salespersonId: '8583ad7a-b47f-4670-9c92-4d1a2419e3cc',
    orderedPackages: [],
    orderedServices: [
      {
        serviceId: '79bc2d6b-b78d-4485-bfa2-23a53b7acb87',
        amountOrdered: 1,
      },
    ],
    placementTimestamp: new Date('2024-03-24T08:00:00-04:00'),
  },
  {
    id: '79ebae7c-8827-44f6-b073-cc7a2540faba',
    customerId: 'a49ac8a5-dcc4-46f1-b082-a4a549daa091',
    salespersonId: '4562ef66-c5c8-4a70-a49d-620530f4b97d',
    orderedPackages: [
      {
        packageId: '19866178-cfea-431b-8128-21fb14570b6d',
        amountOrdered: 1,
      },
    ],
    orderedServices: [],
    placementTimestamp: new Date('2024-02-04T15:00:00-04:00'),
  },
  {
    id: '10f6e591-c000-4a1b-a76a-23d607d323df',
    customerId: '61cfec10-9d6e-4aea-b520-85ccd187bf09',
    salespersonId: '3c941ad8-672d-4dc7-8829-d3b3134cea97',
    orderedPackages: [],
    orderedServices: [
      {
        serviceId: '68e0d2f5-1c6c-41fb-ab5f-98c9043284f9',
        amountOrdered: 2,
      },
    ],
    placementTimestamp: new Date('2024-02-25T10:00:00-04:00'),
  },
];
