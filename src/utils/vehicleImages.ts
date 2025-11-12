// Map common makes/models to representative images used across the app
const vehicleImageMap: Record<string, string> = {
  // Sports/Performance
  'mustang': 'https://d2kde5ohu8qb21.cloudfront.net/files/68c9c7f8c0aa4a0002763d55/002-2025-ford-mustang-gtd-front-three-quarter-action.jpg',
  'camaro': 'https://d2kde5ohu8qb21.cloudfront.net/files/68da999cde18ff0002d1b4a0/000-2014-chevy-camaro-zl1-chett-levay-lead.jpg',
  'corvette': 'https://d2kde5ohu8qb21.cloudfront.net/files/6892b5b0b6d64f0002a3dc4b/2026chevroletcorvettezr1xquailsilverlimitededitionsportscarsupercarvetteconvertible-8.jpg',
  'challenger': 'https://d2kde5ohu8qb21.cloudfront.net/files/660c96337d393d00087e73b6/022-2024-dodge-demon-challenger.jpg',
  '2024 dodge challenger': 'https://d2kde5ohu8qb21.cloudfront.net/files/660c96337d393d00087e73b6/022-2024-dodge-demon-challenger.jpg',
  '2023 dodge challenger': 'https://d2kde5ohu8qb21.cloudfront.net/files/660c96337d393d00087e73b6/022-2024-dodge-demon-challenger.jpg',
  '2022 dodge challenger': 'https://d2kde5ohu8qb21.cloudfront.net/files/660c96337d393d00087e73b6/022-2024-dodge-demon-challenger.jpg',
  '2021 dodge challenger': 'https://d2kde5ohu8qb21.cloudfront.net/files/660c96337d393d00087e73b6/022-2024-dodge-demon-challenger.jpg',
  'supra': 'https://images.unsplash.com/photo-1619767886558-efdc259c3988?w=800&q=80&auto=format&fit=crop',
  '2025 subaru wrx': 'https://d2kde5ohu8qb21.cloudfront.net/files/670dd37c5cb71f0008d1935f/2025-subaru-wrx-ts-079.jpg',
  '2024 subaru wrx': 'https://d2kde5ohu8qb21.cloudfront.net/files/6691c38a1be69000085340bb/003-2024-subaru-wrx-tr.jpg',
  '2023 subaru wrx': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a1cee378cd6100089d2bb3/2023-subaru-wrx-motion-front-three-view-25.jpg',
  '2021 subaru wrx': 'https://d2kde5ohu8qb21.cloudfront.net/files/6691c38a1be69000085340bb/003-2024-subaru-wrx-tr.jpg',
  '2020 subaru wrx': 'https://d2kde5ohu8qb21.cloudfront.net/files/6691c38a1be69000085340bb/003-2024-subaru-wrx-tr.jpg',
  '2019 subaru wrx': 'https://d2kde5ohu8qb21.cloudfront.net/files/65b99fa2b3af5800088d6cff/2017-subaru-wrx-sti-on-the-nu-rburgring-ring-front-three-quarters.jpg',
  '2018 subaru wrx': 'https://d2kde5ohu8qb21.cloudfront.net/files/65b99fa2b3af5800088d6cff/2017-subaru-wrx-sti-on-the-nu-rburgring-ring-front-three-quarters.jpg',
  '2017 subaru wrx': 'https://d2kde5ohu8qb21.cloudfront.net/files/65b99fa2b3af5800088d6cff/2017-subaru-wrx-sti-on-the-nu-rburgring-ring-front-three-quarters.jpg',
  '2017 subaru wrx sti': 'https://d2kde5ohu8qb21.cloudfront.net/files/65b99fa2b3af5800088d6cff/2017-subaru-wrx-sti-on-the-nu-rburgring-ring-front-three-quarters.jpg',
  'wrx': 'https://d2kde5ohu8qb21.cloudfront.net/files/68791475d0bc610002e15175/2025subaruunchartedinorangelowrearthreequarters.jpg',
  'brz': 'https://d2kde5ohu8qb21.cloudfront.net/files/6691c38848a17500082a8c35/002-2024-subaru-brz-ts-front-three-quarter-action.jpg',
  '2024 subaru brz': 'https://d2kde5ohu8qb21.cloudfront.net/files/6691c38848a17500082a8c35/002-2024-subaru-brz-ts-front-three-quarter-action.jpg',
  '2023 subaru brz': 'https://d2kde5ohu8qb21.cloudfront.net/files/6691c38848a17500082a8c35/002-2024-subaru-brz-ts-front-three-quarter-action.jpg',
  '2022 subaru brz': 'https://d2kde5ohu8qb21.cloudfront.net/files/6691c38848a17500082a8c35/002-2024-subaru-brz-ts-front-three-quarter-action.jpg',
  '2021 subaru brz': 'https://d2kde5ohu8qb21.cloudfront.net/files/6691c38848a17500082a8c35/002-2024-subaru-brz-ts-front-three-quarter-action.jpg',
  '2020 subaru brz': 'https://d2kde5ohu8qb21.cloudfront.net/files/6691c38848a17500082a8c35/002-2024-subaru-brz-ts-front-three-quarter-action.jpg',
  'm3': 'https://d2kde5ohu8qb21.cloudfront.net/files/68e820187f1963000225fdd9/2026bmwm2turbodesigneditioncoupesportscar-26.jpg',
  '3 series': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4af586546d00008141235/14-2024-bmw-3-series-m340i-front-view.jpg',
  '2024 bmw 3 series': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4af586546d00008141235/14-2024-bmw-3-series-m340i-front-view.jpg',
  '2024 bmw 3-series': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4af586546d00008141235/14-2024-bmw-3-series-m340i-front-view.jpg',
  '2023 bmw 3 series': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4af586546d00008141235/14-2024-bmw-3-series-m340i-front-view.jpg',
  '2023 bmw 3-series': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4af586546d00008141235/14-2024-bmw-3-series-m340i-front-view.jpg',
  '2022 bmw 3 series': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4af586546d00008141235/14-2024-bmw-3-series-m340i-front-view.jpg',
  '2022 bmw 3-series': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4af586546d00008141235/14-2024-bmw-3-series-m340i-front-view.jpg',
  '2021 bmw 3 series': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4af586546d00008141235/14-2024-bmw-3-series-m340i-front-view.jpg',
  '2021 bmw 3-series': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4af586546d00008141235/14-2024-bmw-3-series-m340i-front-view.jpg',
  '2020 bmw 3 series': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4af586546d00008141235/14-2024-bmw-3-series-m340i-front-view.jpg',
  '2020 bmw 3-series': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4af586546d00008141235/14-2024-bmw-3-series-m340i-front-view.jpg',
  '911': 'https://d2kde5ohu8qb21.cloudfront.net/files/68dc4bec967ad900029a891c/006-2025-porsche-911-t.jpg',
  'xjs': 'https://d2kde5ohu8qb21.cloudfront.net/files/66311be1044cdd0008784ea2/2024jaguarxjstwrperformancesupercatsuper-gt-11.jpg',
  '2024 jaguar xjs': 'https://d2kde5ohu8qb21.cloudfront.net/files/66311be1044cdd0008784ea2/2024jaguarxjstwrperformancesupercatsuper-gt-11.jpg',
  '2024 jaguar xj s': 'https://d2kde5ohu8qb21.cloudfront.net/files/66311be1044cdd0008784ea2/2024jaguarxjstwrperformancesupercatsuper-gt-11.jpg',
  '2023 jaguar xjs': 'https://d2kde5ohu8qb21.cloudfront.net/files/66311be1044cdd0008784ea2/2024jaguarxjstwrperformancesupercatsuper-gt-11.jpg',
  '2023 jaguar xj s': 'https://d2kde5ohu8qb21.cloudfront.net/files/66311be1044cdd0008784ea2/2024jaguarxjstwrperformancesupercatsuper-gt-11.jpg',
  '2022 jaguar xjs': 'https://d2kde5ohu8qb21.cloudfront.net/files/66311be1044cdd0008784ea2/2024jaguarxjstwrperformancesupercatsuper-gt-11.jpg',
  '2022 jaguar xj s': 'https://d2kde5ohu8qb21.cloudfront.net/files/66311be1044cdd0008784ea2/2024jaguarxjstwrperformancesupercatsuper-gt-11.jpg',
  '2021 jaguar xjs': 'https://d2kde5ohu8qb21.cloudfront.net/files/66311be1044cdd0008784ea2/2024jaguarxjstwrperformancesupercatsuper-gt-11.jpg',
  '2021 jaguar xj s': 'https://d2kde5ohu8qb21.cloudfront.net/files/66311be1044cdd0008784ea2/2024jaguarxjstwrperformancesupercatsuper-gt-11.jpg',
  'xe': 'https://d2kde5ohu8qb21.cloudfront.net/files/65dc54cc62068d0008877498/2020-jaguar-xe-p300-side-in-motion.jpg',
  '2024 jaguar xe': 'https://d2kde5ohu8qb21.cloudfront.net/files/65dc54cc62068d0008877498/2020-jaguar-xe-p300-side-in-motion.jpg',
  '2023 jaguar xe': 'https://d2kde5ohu8qb21.cloudfront.net/files/65dc54cc62068d0008877498/2020-jaguar-xe-p300-side-in-motion.jpg',
  '2022 jaguar xe': 'https://d2kde5ohu8qb21.cloudfront.net/files/65dc54cc62068d0008877498/2020-jaguar-xe-p300-side-in-motion.jpg',
  '2021 jaguar xe': 'https://d2kde5ohu8qb21.cloudfront.net/files/65dc54cc62068d0008877498/2020-jaguar-xe-p300-side-in-motion.jpg',
  '2020 jaguar xe': 'https://d2kde5ohu8qb21.cloudfront.net/files/65dc54cc62068d0008877498/2020-jaguar-xe-p300-side-in-motion.jpg',
  'giulia': 'https://d2kde5ohu8qb21.cloudfront.net/files/664529152f5892000891ba31/2024alfaromeogiuliaquadrifogliosupersport-14.jpg',
  '2024 alfa romeo giulia': 'https://d2kde5ohu8qb21.cloudfront.net/files/664529152f5892000891ba31/2024alfaromeogiuliaquadrifogliosupersport-14.jpg',
  '2024 alfaromeo giulia': 'https://d2kde5ohu8qb21.cloudfront.net/files/664529152f5892000891ba31/2024alfaromeogiuliaquadrifogliosupersport-14.jpg',
  '2023 alfa romeo giulia': 'https://d2kde5ohu8qb21.cloudfront.net/files/664529152f5892000891ba31/2024alfaromeogiuliaquadrifogliosupersport-14.jpg',
  '2023 alfaromeo giulia': 'https://d2kde5ohu8qb21.cloudfront.net/files/664529152f5892000891ba31/2024alfaromeogiuliaquadrifogliosupersport-14.jpg',
  '2022 alfa romeo giulia': 'https://d2kde5ohu8qb21.cloudfront.net/files/664529152f5892000891ba31/2024alfaromeogiuliaquadrifogliosupersport-14.jpg',
  '2022 alfaromeo giulia': 'https://d2kde5ohu8qb21.cloudfront.net/files/664529152f5892000891ba31/2024alfaromeogiuliaquadrifogliosupersport-14.jpg',
  '2021 alfa romeo giulia': 'https://d2kde5ohu8qb21.cloudfront.net/files/664529152f5892000891ba31/2024alfaromeogiuliaquadrifogliosupersport-14.jpg',
  '2021 alfaromeo giulia': 'https://d2kde5ohu8qb21.cloudfront.net/files/664529152f5892000891ba31/2024alfaromeogiuliaquadrifogliosupersport-14.jpg',

  // Sedans/Hatchbacks
  'civic': 'https://d2kde5ohu8qb21.cloudfront.net/files/65dcf5210e091c0008b94fd0/2020-honda-civic-si-coupe-front-three-quarter.jpg',
  'accord': 'https://d2kde5ohu8qb21.cloudfront.net/files/679d37b803565f0008090975/21-2025-honda-accord-front-view.jpg',
  'corolla': 'https://d2kde5ohu8qb21.cloudfront.net/files/68dc6648bbe5640002b8f5db/007-2025-toyota-gr-corolla.jpg',
  'camry': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a1d8a7a9b759000861b9bf/2024-toyota-camry-xse-hybrid-front-view-17.jpg',
  '2024 toyota camry': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a1d8a7a9b759000861b9bf/2024-toyota-camry-xse-hybrid-front-view-17.jpg',
  '2023 toyota camry': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a1d8a7a9b759000861b9bf/2024-toyota-camry-xse-hybrid-front-view-17.jpg',
  '2022 toyota camry': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a1d8a7a9b759000861b9bf/2024-toyota-camry-xse-hybrid-front-view-17.jpg',
  '2021 toyota camry': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a1d8a7a9b759000861b9bf/2024-toyota-camry-xse-hybrid-front-view-17.jpg',
  '2020 toyota camry': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a1d8a7a9b759000861b9bf/2024-toyota-camry-xse-hybrid-front-view-17.jpg',
  '2019 toyota camry': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a1d8a7a9b759000861b9bf/2024-toyota-camry-xse-hybrid-front-view-17.jpg',
  'altima': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a38d2e36557c0008a5e89e/2021-nissan-altima-sr-vc-turbo-24.jpg',
  'sentra': 'https://d2kde5ohu8qb21.cloudfront.net/files/68d1d958af6f83000296dd9a/2026nissansentra-oem21.jpg',
  'gti': 'https://d2kde5ohu8qb21.cloudfront.net/files/68ed9049b76c7c0002cf2115/025-2026volkswagen-golf-gti-r-coty.jpg',
  'sonata': 'https://d2kde5ohu8qb21.cloudfront.net/files/66a7f7b4bd127000082bdd96/011-2024-hyundai-sonata-hybrid.jpg',
  '2024 hyundai sonata': 'https://d2kde5ohu8qb21.cloudfront.net/files/66a7f7b4bd127000082bdd96/011-2024-hyundai-sonata-hybrid.jpg',
  '2023 hyundai sonata': 'https://d2kde5ohu8qb21.cloudfront.net/files/66a7f7b4bd127000082bdd96/011-2024-hyundai-sonata-hybrid.jpg',
  '2022 hyundai sonata': 'https://d2kde5ohu8qb21.cloudfront.net/files/66a7f7b4bd127000082bdd96/011-2024-hyundai-sonata-hybrid.jpg',
  '2021 hyundai sonata': 'https://d2kde5ohu8qb21.cloudfront.net/files/66a7f7b4bd127000082bdd96/011-2024-hyundai-sonata-hybrid.jpg',
  'g70': 'https://d2kde5ohu8qb21.cloudfront.net/files/6737b61a6511850008886d2d/004-2024-genesis-g70-2-5t-awd-front-three-quarter-action.jpg',
  '2024 genesis g70': 'https://d2kde5ohu8qb21.cloudfront.net/files/6737b61a6511850008886d2d/004-2024-genesis-g70-2-5t-awd-front-three-quarter-action.jpg',
  '2023 genesis g70': 'https://d2kde5ohu8qb21.cloudfront.net/files/6737b61a6511850008886d2d/004-2024-genesis-g70-2-5t-awd-front-three-quarter-action.jpg',
  '2022 genesis g70': 'https://d2kde5ohu8qb21.cloudfront.net/files/6737b61a6511850008886d2d/004-2024-genesis-g70-2-5t-awd-front-three-quarter-action.jpg',
  '2021 genesis g70': 'https://d2kde5ohu8qb21.cloudfront.net/files/6737b61a6511850008886d2d/004-2024-genesis-g70-2-5t-awd-front-three-quarter-action.jpg',
  'tlx': 'https://d2kde5ohu8qb21.cloudfront.net/files/65f7f488e7e84a0008f4cb9b/004-2024-acura-tlx-type-s-front-three-quarter-motion.jpg',
  '2024 acura tlx': 'https://d2kde5ohu8qb21.cloudfront.net/files/65f7f488e7e84a0008f4cb9b/004-2024-acura-tlx-type-s-front-three-quarter-motion.jpg',
  '2023 acura tlx': 'https://d2kde5ohu8qb21.cloudfront.net/files/65f7f488e7e84a0008f4cb9b/004-2024-acura-tlx-type-s-front-three-quarter-motion.jpg',
  '2022 acura tlx': 'https://d2kde5ohu8qb21.cloudfront.net/files/65f7f488e7e84a0008f4cb9b/004-2024-acura-tlx-type-s-front-three-quarter-motion.jpg',
  '2021 acura tlx': 'https://d2kde5ohu8qb21.cloudfront.net/files/65f7f488e7e84a0008f4cb9b/004-2024-acura-tlx-type-s-front-three-quarter-motion.jpg',
  'adx': 'https://d2kde5ohu8qb21.cloudfront.net/files/6735197dfea200000873d814/002-2025-acura-adx.jpg',
  '2025 acura adx': 'https://d2kde5ohu8qb21.cloudfront.net/files/6735197dfea200000873d814/002-2025-acura-adx.jpg',
  '2025 acura ad-x': 'https://d2kde5ohu8qb21.cloudfront.net/files/6735197dfea200000873d814/002-2025-acura-adx.jpg',
  'acura adx': 'https://d2kde5ohu8qb21.cloudfront.net/files/6735197dfea200000873d814/002-2025-acura-adx.jpg',
  'acura ad-x': 'https://d2kde5ohu8qb21.cloudfront.net/files/6735197dfea200000873d814/002-2025-acura-adx.jpg',
  'legacy': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a04773d0229100083d285e/2024-subaru-legacy-4.jpg',
  '2024 subaru legacy': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a04773d0229100083d285e/2024-subaru-legacy-4.jpg',
  '2023 subaru legacy': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a04773d0229100083d285e/2024-subaru-legacy-4.jpg',
  '2022 subaru legacy': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a04773d0229100083d285e/2024-subaru-legacy-4.jpg',
  '2021 subaru legacy': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a04773d0229100083d285e/2024-subaru-legacy-4.jpg',
  '2020 subaru legacy': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a04773d0229100083d285e/2024-subaru-legacy-4.jpg',
  'mazda6': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a25f02f2a5f400083c56d9/mazda6-rwd-1.jpg',
  'mazda 6': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a25f02f2a5f400083c56d9/mazda6-rwd-1.jpg',
  '2024 mazda6': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a25f02f2a5f400083c56d9/mazda6-rwd-1.jpg',
  '2024 mazda 6': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a25f02f2a5f400083c56d9/mazda6-rwd-1.jpg',
  '2023 mazda6': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a25f02f2a5f400083c56d9/mazda6-rwd-1.jpg',
  '2023 mazda 6': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a25f02f2a5f400083c56d9/mazda6-rwd-1.jpg',
  '2022 mazda6': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a25f02f2a5f400083c56d9/mazda6-rwd-1.jpg',
  '2022 mazda 6': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a25f02f2a5f400083c56d9/mazda6-rwd-1.jpg',
  '2021 mazda6': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a25f02f2a5f400083c56d9/mazda6-rwd-1.jpg',
  '2021 mazda 6': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a25f02f2a5f400083c56d9/mazda6-rwd-1.jpg',
  '2020 mazda6': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a25f02f2a5f400083c56d9/mazda6-rwd-1.jpg',
  '2020 mazda 6': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a25f02f2a5f400083c56d9/mazda6-rwd-1.jpg',
  'a4': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a43bc96caf0900080f42f8/11-2024-audi-a4-front-view.jpg',
  '2024 audi a4': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a43bc96caf0900080f42f8/11-2024-audi-a4-front-view.jpg',
  '2023 audi a4': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a43bc96caf0900080f42f8/11-2024-audi-a4-front-view.jpg',
  '2022 audi a4': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a43bc96caf0900080f42f8/11-2024-audi-a4-front-view.jpg',
  '2021 audi a4': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a43bc96caf0900080f42f8/11-2024-audi-a4-front-view.jpg',
  '2020 audi a4': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a43bc96caf0900080f42f8/11-2024-audi-a4-front-view.jpg',
  'q50': 'https://d2kde5ohu8qb21.cloudfront.net/files/668464035740700008c1afa8/001-2024-infiniti-q50s-lead.jpg',
  '2024 infiniti q50': 'https://d2kde5ohu8qb21.cloudfront.net/files/668464035740700008c1afa8/001-2024-infiniti-q50s-lead.jpg',
  '2023 infiniti q50': 'https://d2kde5ohu8qb21.cloudfront.net/files/668464035740700008c1afa8/001-2024-infiniti-q50s-lead.jpg',
  '2022 infiniti q50': 'https://d2kde5ohu8qb21.cloudfront.net/files/668464035740700008c1afa8/001-2024-infiniti-q50s-lead.jpg',
  '2021 infiniti q50': 'https://d2kde5ohu8qb21.cloudfront.net/files/668464035740700008c1afa8/001-2024-infiniti-q50s-lead.jpg',
  '2020 infiniti q50': 'https://d2kde5ohu8qb21.cloudfront.net/files/668464035740700008c1afa8/001-2024-infiniti-q50s-lead.jpg',
  
  // Specific vehicle mappings
  'lexus is': 'https://d2kde5ohu8qb21.cloudfront.net/files/673e2fc358346600088a2bfc/009-2024-lexus-is500-v-8.jpg',
  '2024 lexus is': 'https://d2kde5ohu8qb21.cloudfront.net/files/673e2fc358346600088a2bfc/009-2024-lexus-is500-v-8.jpg',
  '2023 lexus is': 'https://d2kde5ohu8qb21.cloudfront.net/files/673e2fc358346600088a2bfc/009-2024-lexus-is500-v-8.jpg',
  '2022 lexus is': 'https://d2kde5ohu8qb21.cloudfront.net/files/673e2fc358346600088a2bfc/009-2024-lexus-is500-v-8.jpg',
  '2021 lexus is': 'https://d2kde5ohu8qb21.cloudfront.net/files/673e2fc358346600088a2bfc/009-2024-lexus-is500-v-8.jpg',
  '2020 lexus is': 'https://d2kde5ohu8qb21.cloudfront.net/files/673e2fc358346600088a2bfc/009-2024-lexus-is500-v-8.jpg',
  
  'cadillac ct4': 'https://d2kde5ohu8qb21.cloudfront.net/files/667df8932d6fea0008ff6351/2024-cadillac-ct4-v-blackwing-100.jpg',
  '2024 cadillac ct4': 'https://d2kde5ohu8qb21.cloudfront.net/files/667df8932d6fea0008ff6351/2024-cadillac-ct4-v-blackwing-100.jpg',
  '2023 cadillac ct4': 'https://d2kde5ohu8qb21.cloudfront.net/files/667df8932d6fea0008ff6351/2024-cadillac-ct4-v-blackwing-100.jpg',
  '2022 cadillac ct4': 'https://d2kde5ohu8qb21.cloudfront.net/files/667df8932d6fea0008ff6351/2024-cadillac-ct4-v-blackwing-100.jpg',
  '2021 cadillac ct4': 'https://d2kde5ohu8qb21.cloudfront.net/files/667df8932d6fea0008ff6351/2024-cadillac-ct4-v-blackwing-100.jpg',
  
  'volvo s60': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4d3a5adf0e500089ab45d/16-2024-volvo-s60-recharge-awd-black-edition-side-view.jpg',
  '2024 volvo s60': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4d3a5adf0e500089ab45d/16-2024-volvo-s60-recharge-awd-black-edition-side-view.jpg',
  '2023 volvo s60': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4d3a5adf0e500089ab45d/16-2024-volvo-s60-recharge-awd-black-edition-side-view.jpg',
  '2022 volvo s60': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4d3a5adf0e500089ab45d/16-2024-volvo-s60-recharge-awd-black-edition-side-view.jpg',
  '2021 volvo s60': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4d3a5adf0e500089ab45d/16-2024-volvo-s60-recharge-awd-black-edition-side-view.jpg',
  '2020 volvo s60': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4d3a5adf0e500089ab45d/16-2024-volvo-s60-recharge-awd-black-edition-side-view.jpg',
  
  'mercedes cla': 'https://d2kde5ohu8qb21.cloudfront.net/files/66ba75615abeb400086d9c7e/016-2024-mercedes-benz-cla250.jpg',
  'mercedes c-class': 'https://d2kde5ohu8qb21.cloudfront.net/files/66ba75615abeb400086d9c7e/016-2024-mercedes-benz-cla250.jpg',
  '2024 mercedes c-class': 'https://d2kde5ohu8qb21.cloudfront.net/files/66ba75615abeb400086d9c7e/016-2024-mercedes-benz-cla250.jpg',
  '2023 mercedes c-class': 'https://d2kde5ohu8qb21.cloudfront.net/files/66ba75615abeb400086d9c7e/016-2024-mercedes-benz-cla250.jpg',
  '2022 mercedes c-class': 'https://d2kde5ohu8qb21.cloudfront.net/files/66ba75615abeb400086d9c7e/016-2024-mercedes-benz-cla250.jpg',
  '2021 mercedes c-class': 'https://d2kde5ohu8qb21.cloudfront.net/files/66ba75615abeb400086d9c7e/016-2024-mercedes-benz-cla250.jpg',
  '2020 mercedes c-class': 'https://d2kde5ohu8qb21.cloudfront.net/files/66ba75615abeb400086d9c7e/016-2024-mercedes-benz-cla250.jpg',

  // SUVs/Trucks
  'suburban': 'https://d2kde5ohu8qb21.cloudfront.net/files/65b8d9bfcad57f00087ba770/2021-chevrolet-suburban-frt-02.jpg',
  'bronco': 'https://d2kde5ohu8qb21.cloudfront.net/files/67237b68a0efe50008b489ed/2025fordbroncowildfundsemasuv10.png',
  'bronco sport': 'https://d2kde5ohu8qb21.cloudfront.net/files/674e2b7efe24400008290ba0/003-2025-ford-bronco-free-wheeling.jpg',
  'f-150': 'https://d2kde5ohu8qb21.cloudfront.net/files/68f7f7d98e933e0002e8c24b/001-2026f-150lightningstx-side-view.jpg',
  'f-150 lightning': 'https://d2kde5ohu8qb21.cloudfront.net/files/68b9ebde156e4300022c4b79/2026fordf-150lightningstxevelectricvehiclepickuptruck-16.jpg',
  '2026 ford f-150': 'https://d2kde5ohu8qb21.cloudfront.net/files/68f7f7d98e933e0002e8c24b/001-2026f-150lightningstx-side-view.jpg',
  '2026 f-150': 'https://d2kde5ohu8qb21.cloudfront.net/files/68f7f7d98e933e0002e8c24b/001-2026f-150lightningstx-side-view.jpg',
  '2025 ford f-150 lightning': 'https://d2kde5ohu8qb21.cloudfront.net/files/68b9ebde156e4300022c4b79/2026fordf-150lightningstxevelectricvehiclepickuptruck-16.jpg',
  '2025 ford f-150-lightning': 'https://d2kde5ohu8qb21.cloudfront.net/files/68b9ebde156e4300022c4b79/2026fordf-150lightningstxevelectricvehiclepickuptruck-16.jpg',
  '2025 ford f-150': 'https://d2kde5ohu8qb21.cloudfront.net/files/68c090307123160002bf3d2c/2025fordf-150roushperformancert6offroadpickuptruck-15.jpg',
  '2025 f-150': 'https://d2kde5ohu8qb21.cloudfront.net/files/68c090307123160002bf3d2c/2025fordf-150roushperformancert6offroadpickuptruck-15.jpg',
  '2023 chevrolet silverado': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a1abe05e5f6c0008edb5b4/005-2022-chevrolet-silverado-zr2-toty2023.jpg',
  '2023 silverado': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a1abe05e5f6c0008edb5b4/005-2022-chevrolet-silverado-zr2-toty2023.jpg',
  'silverado': 'https://d2kde5ohu8qb21.cloudfront.net/files/68913ffd88ee3a00023d0ca4/silveradoevwtrangetestdynamic.png',
  'ram': 'https://d2kde5ohu8qb21.cloudfront.net/files/68b8a8e72e52fc0002299f4c/1-2026-ram-2500-warlock.jpg',
  'ranger': 'https://d2kde5ohu8qb21.cloudfront.net/files/674770f01721ce0008856fcf/002-2024-ford-ranger-lariat-front-three-quarter-motion.jpg',
  '2024 ford ranger': 'https://d2kde5ohu8qb21.cloudfront.net/files/674770f01721ce0008856fcf/002-2024-ford-ranger-lariat-front-three-quarter-motion.jpg',
  '2023 ford ranger': 'https://d2kde5ohu8qb21.cloudfront.net/files/674770f01721ce0008856fcf/002-2024-ford-ranger-lariat-front-three-quarter-motion.jpg',
  '2022 ford ranger': 'https://d2kde5ohu8qb21.cloudfront.net/files/674770f01721ce0008856fcf/002-2024-ford-ranger-lariat-front-three-quarter-motion.jpg',
  '2021 ford ranger': 'https://d2kde5ohu8qb21.cloudfront.net/files/674770f01721ce0008856fcf/002-2024-ford-ranger-lariat-front-three-quarter-motion.jpg',
  '2020 ford ranger': 'https://d2kde5ohu8qb21.cloudfront.net/files/674770f01721ce0008856fcf/002-2024-ford-ranger-lariat-front-three-quarter-motion.jpg',
  'maverick': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4e03c2189f7000872fb6a/2024-ford-maverick-front-view-89.jpg',
  '2024 ford maverick': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4e03c2189f7000872fb6a/2024-ford-maverick-front-view-89.jpg',
  '2023 ford maverick': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4e03c2189f7000872fb6a/2024-ford-maverick-front-view-89.jpg',
  '2022 ford maverick': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4e03c2189f7000872fb6a/2024-ford-maverick-front-view-89.jpg',
  '2021 ford maverick': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4e03c2189f7000872fb6a/2024-ford-maverick-front-view-89.jpg',
  '2020 ford maverick': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4e03c2189f7000872fb6a/2024-ford-maverick-front-view-89.jpg',
  'edge': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4ab4b52f2c7000819a367/11-2024-ford-edge-front-view.jpg',
  '2024 ford edge': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4ab4b52f2c7000819a367/11-2024-ford-edge-front-view.jpg',
  '2023 ford edge': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4ab4b52f2c7000819a367/11-2024-ford-edge-front-view.jpg',
  '2022 ford edge': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4ab4b52f2c7000819a367/11-2024-ford-edge-front-view.jpg',
  '2021 ford edge': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4ab4b52f2c7000819a367/11-2024-ford-edge-front-view.jpg',
  '2020 ford edge': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4ab4b52f2c7000819a367/11-2024-ford-edge-front-view.jpg',
  'explorer': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4c63228292d000815e944/6-2024-ford-explorer-front-view.jpg',
  '2024 ford explorer': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4c63228292d000815e944/6-2024-ford-explorer-front-view.jpg',
  '2023 ford explorer': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4c63228292d000815e944/6-2024-ford-explorer-front-view.jpg',
  '2022 ford explorer': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4c63228292d000815e944/6-2024-ford-explorer-front-view.jpg',
  '2021 ford explorer': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4c63228292d000815e944/6-2024-ford-explorer-front-view.jpg',
  '2020 ford explorer': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4c63228292d000815e944/6-2024-ford-explorer-front-view.jpg',
  'escape': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a479cdfc8dbb0008e5ccaf/002-2024-ford-escape-phev-front-three-quarters-in-action-scaled.jpg',
  '2024 ford escape': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a479cdfc8dbb0008e5ccaf/002-2024-ford-escape-phev-front-three-quarters-in-action-scaled.jpg',
  '2023 ford escape': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a07b144cb8920008829782/2023-ford-escape-st-line-12.jpg',
  '2022 ford escape': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a479cdfc8dbb0008e5ccaf/002-2024-ford-escape-phev-front-three-quarters-in-action-scaled.jpg',
  '2021 ford escape': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a479cdfc8dbb0008e5ccaf/002-2024-ford-escape-phev-front-three-quarters-in-action-scaled.jpg',
  '2020 ford escape': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a479cdfc8dbb0008e5ccaf/002-2024-ford-escape-phev-front-three-quarters-in-action-scaled.jpg',
  'rav4': 'https://d2kde5ohu8qb21.cloudfront.net/files/682cd83b39615000089431b5/2026toyotarav4hybridsuvcrossover-1.jpg',
  'cr-v': 'https://d2kde5ohu8qb21.cloudfront.net/files/685edc71f123b4000238efd1/10-2026-honda-cr-v-trailsport.jpg',
  'passport': 'https://d2kde5ohu8qb21.cloudfront.net/files/690a5f1c69a9550002fb94b7/024-2026-honda-passport-rtl.jpg',
  'passport rtl': 'https://d2kde5ohu8qb21.cloudfront.net/files/690a5f1c69a9550002fb94b7/024-2026-honda-passport-rtl.jpg',
  'passport-rtl': 'https://d2kde5ohu8qb21.cloudfront.net/files/690a5f1c69a9550002fb94b7/024-2026-honda-passport-rtl.jpg',
  '2026 honda passport': 'https://d2kde5ohu8qb21.cloudfront.net/files/690a5f1c69a9550002fb94b7/024-2026-honda-passport-rtl.jpg',
  '2026 honda passport rtl': 'https://d2kde5ohu8qb21.cloudfront.net/files/690a5f1c69a9550002fb94b7/024-2026-honda-passport-rtl.jpg',
  '2026 honda passport-rtl': 'https://d2kde5ohu8qb21.cloudfront.net/files/690a5f1c69a9550002fb94b7/024-2026-honda-passport-rtl.jpg',
  '2025 honda passport': 'https://d2kde5ohu8qb21.cloudfront.net/files/690a5f1c69a9550002fb94b7/024-2026-honda-passport-rtl.jpg',
  '2024 honda passport': 'https://d2kde5ohu8qb21.cloudfront.net/files/690a5f1c69a9550002fb94b7/024-2026-honda-passport-rtl.jpg',
  '2023 honda passport': 'https://d2kde5ohu8qb21.cloudfront.net/files/690a5f1c69a9550002fb94b7/024-2026-honda-passport-rtl.jpg',
  '2022 honda passport': 'https://d2kde5ohu8qb21.cloudfront.net/files/690a5f1c69a9550002fb94b7/024-2026-honda-passport-rtl.jpg',
  '2021 honda passport': 'https://d2kde5ohu8qb21.cloudfront.net/files/690a5f1c69a9550002fb94b7/024-2026-honda-passport-rtl.jpg',
  '2020 honda passport': 'https://d2kde5ohu8qb21.cloudfront.net/files/690a5f1c69a9550002fb94b7/024-2026-honda-passport-rtl.jpg',
  'cx-5': 'https://d2kde5ohu8qb21.cloudfront.net/files/686c4f52a5f0070002f31f87/2026mazdacx-517.jpg',
  'cx-30': 'https://d2kde5ohu8qb21.cloudfront.net/files/66c3b56305d26600081bc616/034-2024-mazda-cx-30.jpg',
  '2024 mazda cx-30': 'https://d2kde5ohu8qb21.cloudfront.net/files/66c3b56305d26600081bc616/034-2024-mazda-cx-30.jpg',
  '2023 mazda cx-30': 'https://d2kde5ohu8qb21.cloudfront.net/files/66c3b56305d26600081bc616/034-2024-mazda-cx-30.jpg',
  '2022 mazda cx-30': 'https://d2kde5ohu8qb21.cloudfront.net/files/66c3b56305d26600081bc616/034-2024-mazda-cx-30.jpg',
  '2021 mazda cx-30': 'https://d2kde5ohu8qb21.cloudfront.net/files/66c3b56305d26600081bc616/034-2024-mazda-cx-30.jpg',
  '2020 mazda cx-30': 'https://d2kde5ohu8qb21.cloudfront.net/files/66c3b56305d26600081bc616/034-2024-mazda-cx-30.jpg',
  
  'crosstrek': 'https://d2kde5ohu8qb21.cloudfront.net/files/66c3b57031c1ec0008b2690e/042-2024-subaru-crosstrek-sport.jpg',
  '2024 subaru crosstrek': 'https://d2kde5ohu8qb21.cloudfront.net/files/66c3b57031c1ec0008b2690e/042-2024-subaru-crosstrek-sport.jpg',
  '2023 subaru crosstrek': 'https://d2kde5ohu8qb21.cloudfront.net/files/66c3b57031c1ec0008b2690e/042-2024-subaru-crosstrek-sport.jpg',
  '2022 subaru crosstrek': 'https://d2kde5ohu8qb21.cloudfront.net/files/66c3b57031c1ec0008b2690e/042-2024-subaru-crosstrek-sport.jpg',
  '2021 subaru crosstrek': 'https://d2kde5ohu8qb21.cloudfront.net/files/66c3b57031c1ec0008b2690e/042-2024-subaru-crosstrek-sport.jpg',
  '2020 subaru crosstrek': 'https://d2kde5ohu8qb21.cloudfront.net/files/66c3b57031c1ec0008b2690e/042-2024-subaru-crosstrek-sport.jpg',
  
  'impreza': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a184ea38db2a00083e1756/2024-subaru-impreza-hatchback-debut-15.jpg',
  '2024 subaru impreza': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a184ea38db2a00083e1756/2024-subaru-impreza-hatchback-debut-15.jpg',
  '2023 subaru impreza': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a184ea38db2a00083e1756/2024-subaru-impreza-hatchback-debut-15.jpg',
  '2022 subaru impreza': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a184ea38db2a00083e1756/2024-subaru-impreza-hatchback-debut-15.jpg',
  '2021 subaru impreza': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a184ea38db2a00083e1756/2024-subaru-impreza-hatchback-debut-15.jpg',
  '2020 subaru impreza': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a184ea38db2a00083e1756/2024-subaru-impreza-hatchback-debut-15.jpg',
  'forester': 'https://d2kde5ohu8qb21.cloudfront.net/files/669ec0db2080500008c3fc71/008-2024-subaru-forester-sport.jpg',
  '2024 subaru forester': 'https://d2kde5ohu8qb21.cloudfront.net/files/669ec0db2080500008c3fc71/008-2024-subaru-forester-sport.jpg',
  '2023 subaru forester': 'https://d2kde5ohu8qb21.cloudfront.net/files/669ec0db2080500008c3fc71/008-2024-subaru-forester-sport.jpg',
  '2022 subaru forester': 'https://d2kde5ohu8qb21.cloudfront.net/files/669ec0db2080500008c3fc71/008-2024-subaru-forester-sport.jpg',
  '2021 subaru forester': 'https://d2kde5ohu8qb21.cloudfront.net/files/669ec0db2080500008c3fc71/008-2024-subaru-forester-sport.jpg',
  '2020 subaru forester': 'https://d2kde5ohu8qb21.cloudfront.net/files/669ec0db2080500008c3fc71/008-2024-subaru-forester-sport.jpg',
  'outback': 'https://d2kde5ohu8qb21.cloudfront.net/files/659f9ebbdaa056000860a18b/2023-subaru-outback-2-scaled.jpg',
  '2024 subaru outback': 'https://d2kde5ohu8qb21.cloudfront.net/files/659f9ebbdaa056000860a18b/2023-subaru-outback-2-scaled.jpg',
  '2023 subaru outback': 'https://d2kde5ohu8qb21.cloudfront.net/files/659f9ebbdaa056000860a18b/2023-subaru-outback-2-scaled.jpg',
  '2022 subaru outback': 'https://d2kde5ohu8qb21.cloudfront.net/files/659f9ebbdaa056000860a18b/2023-subaru-outback-2-scaled.jpg',
  '2021 subaru outback': 'https://d2kde5ohu8qb21.cloudfront.net/files/659f9ebbdaa056000860a18b/2023-subaru-outback-2-scaled.jpg',
  '2020 subaru outback': 'https://d2kde5ohu8qb21.cloudfront.net/files/659f9ebbdaa056000860a18b/2023-subaru-outback-2-scaled.jpg',
  'ascent': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4320a9c6213000853402a/026-2024-subaru-ascent-front-view.jpg',
  '2024 subaru ascent': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4320a9c6213000853402a/026-2024-subaru-ascent-front-view.jpg',
  '2023 subaru ascent': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4320a9c6213000853402a/026-2024-subaru-ascent-front-view.jpg',
  '2022 subaru ascent': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4320a9c6213000853402a/026-2024-subaru-ascent-front-view.jpg',
  '2021 subaru ascent': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4320a9c6213000853402a/026-2024-subaru-ascent-front-view.jpg',
  '2020 subaru ascent': 'https://d2kde5ohu8qb21.cloudfront.net/files/65a4320a9c6213000853402a/026-2024-subaru-ascent-front-view.jpg',

  // Kia
  'stinger': 'https://d2kde5ohu8qb21.cloudfront.net/files/65c317fbd42a2f00084bae9d/2020-kia-stinger-gt2-awd-front-three-quarter-in-motion-2.jpg',

  // Tesla
  'model 3': 'https://d2kde5ohu8qb21.cloudfront.net/files/68e5862037f20500027cfb5f/2026teslamodel3standardrwdevelectricvehiclesedan-14.jpg',
  'model s': 'https://d2kde5ohu8qb21.cloudfront.net/files/68e5863676e22400025001a9/2026teslamodelystandardrwdsuvevelectricvehiclecrossover-12.jpg',

  // Rivian
  '2026 rivian r2': 'https://d2kde5ohu8qb21.cloudfront.net/files/65f8061eb53e720008a3bb02/2026-rivian-r2-ev-suv-10.jpg',
  '2026 rivian r-2': 'https://d2kde5ohu8qb21.cloudfront.net/files/65f8061eb53e720008a3bb02/2026-rivian-r2-ev-suv-10.jpg',
  'rivian r2': 'https://d2kde5ohu8qb21.cloudfront.net/files/65f8061eb53e720008a3bb02/2026-rivian-r2-ev-suv-10.jpg',
  'rivian r-2': 'https://d2kde5ohu8qb21.cloudfront.net/files/65f8061eb53e720008a3bb02/2026-rivian-r2-ev-suv-10.jpg',

  // Hyundai Ioniq 6 N
  '2026 hyundai ioniq 6 n': 'https://d2kde5ohu8qb21.cloudfront.net/files/67ef547e9e2b380008ba43f0/2026hyundaiioniq6nlineevelectricsedan-13.jpg',
  '2026 hyundai ioniq-6-n': 'https://d2kde5ohu8qb21.cloudfront.net/files/67ef547e9e2b380008ba43f0/2026hyundaiioniq6nlineevelectricsedan-13.jpg',
  'ioniq 6 n': 'https://d2kde5ohu8qb21.cloudfront.net/files/67ef547e9e2b380008ba43f0/2026hyundaiioniq6nlineevelectricsedan-13.jpg',
  'ioniq-6-n': 'https://d2kde5ohu8qb21.cloudfront.net/files/67ef547e9e2b380008ba43f0/2026hyundaiioniq6nlineevelectricsedan-13.jpg'
};

export const vehicleImageFor = (vehicleName: string): string => {
  const name = vehicleName.toLowerCase();
  const keysBySpecificity = Object.keys(vehicleImageMap).sort((a, b) => b.length - a.length);
  for (const key of keysBySpecificity) {
    if (name.includes(key)) return vehicleImageMap[key];
  }
  return 'https://d2kde5ohu8qb21.cloudfront.net/files/6812b286427f560008656f60/2026-toyota-camry-nightshade-001.jpg';
};

export default vehicleImageFor;

/**
 * Parse vehicle name into year, make, and model for URL routing
 * Example: "2025 BMW 3-Series" -> { year: "2025", make: "BMW", model: "3-Series" }
 */
export const parseVehicleName = (vehicleName: string): { year: string; make: string; model: string } => {
  const parts = vehicleName.trim().split(/\s+/);
  
  // Extract year (first 4-digit number)
  let year = '2025'; // default
  let make = '';
  let model = '';
  
  const yearIndex = parts.findIndex(part => /^\d{4}$/.test(part));
  
  if (yearIndex !== -1) {
    year = parts[yearIndex];
    // Everything after year is make and model
    const remaining = parts.slice(yearIndex + 1);
    if (remaining.length > 0) {
      make = remaining[0];
      model = remaining.slice(1).join('-');
    }
  } else {
    // No year found, assume first part is make
    if (parts.length > 0) {
      make = parts[0];
      model = parts.slice(1).join('-');
    }
  }
  
  // Defaults if parsing fails
  if (!make) make = 'BMW';
  if (!model) model = '3-Series';
  
  return {
    year: encodeURIComponent(year),
    make: encodeURIComponent(make),
    model: encodeURIComponent(model)
  };
};


