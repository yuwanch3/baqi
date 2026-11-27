const ENGLISH_LEVEL_TITLES = {
  PFC000000001: 'Petrophysics Chapter 1 - Introduction to Petrophysics and Reservoir Rocks',
  PFC000000002: 'Petrophysics Chapter 2 - Physical Properties of Reservoir Rocks',
  PFC000000003: 'Petrophysics Chapter 3 - Physical Properties of Reservoir Fluids',
  PFC000000004: 'Petrophysics Chapter 4 - Wireline Logging',
  PFC000000005: 'Petrophysics Chapter 5 - Log Interpretation and Formation Evaluation',
  PFC000000006: 'Petrophysics Chapter 6 - Capillary Pressure and Relative Permeability',
  PFC000000007: 'Petrophysics Chapter 7 - Petrophysics Applications and Volume Estimation',
  PFC000000008: 'CEOR Chapter 1 - Introduction to Enhanced Oil Recovery',
  PFC000000009: 'CEOR Chapter 2 - Chemical EOR Polymer Flooding',
  PFC000000010: 'CEOR Chapter 3 - Chemical EOR Surfactant and Alkaline',
  PFC000000011: 'CEOR Chapter 4 - Thermal EOR and Gas EOR',
  PFC000000012: 'CEOR Chapter 5 - Economic Project Planning and CEOR Applications',
  PFC000000013: 'Unconventional Oil and Gas Chapter 1 - Introduction and Classification',
  PFC000000014: 'Unconventional Oil and Gas Chapter 2 - Characterization and Properties of Oil Sands',
  PFC000000015: 'Unconventional Oil and Gas Chapter 3 - Reserves, Production, and Development of Oil Sands',
  PFC000000016: 'Unconventional Oil and Gas Chapter 4 - Characterization and Development of Heavy Oil',
  PFC000000017: 'Unconventional Oil and Gas Chapter 5 - Oil Shale and Synthetic Fuel',
  PFC000000018: 'Unconventional Oil and Gas Chapter 6 - Low-Permeability Oil',
  PFC000000019: 'Unconventional Oil and Gas Chapter 7 - Oil Rim',
  PFC000000020: 'Unconventional Oil and Gas Chapter 8 - Tight Reservoir',
  PFC000000021: 'Well Testing and Acidizing Chapter 1 - Introduction',
  PFC000000022: 'Well Testing and Acidizing Chapter 2 - Acidizing',
  PFC000000023: 'Well Testing and Acidizing Chapter 3 - Acid Reactions',
  PFC000000024: 'Well Testing and Acidizing Chapter 4 - Acid Distribution',
};

const ENGLISH_MATERIAL_TITLES = {
  PFM000000001: 'Definition and Scope of Petrophysics',
  PFM000000002: 'The Role of Petrophysics in Exploration and Production',
  PFM000000003: 'Types of Reservoir Rocks',
  PFM000000004: 'Texture, Consolidation, and Depositional Environment',
  PFM000000005: 'Hydrocarbon Systems',
  PFM000000006: 'Traps and Accumulation',
  PFM000000007: 'Porosity Concepts and Types',
  PFM000000008: 'Porosity Factors and Measurement',
  PFM000000009: 'Permeability Concepts and Darcy\'s Law',
  PFM000000010: 'Permeability Types and Measurement',
  PFM000000011: 'Reservoir Fluid Saturation',
  PFM000000012: 'Porosity-Permeability-Saturation Relationships',
  PFM000000013: 'Hydrocarbon Composition and Phases',
  PFM000000014: 'Types of Reservoir Fluids',
  PFM000000015: 'PVT and Formation Volume Factor',
  PFM000000016: 'Fluid Viscosity and Density',
  PFM000000017: 'Formation Water Properties',
  PFM000000018: 'Rock Resistivity and Shale Effects',
  PFM000000019: 'Logging Principles and Types',
  PFM000000020: 'Gamma Ray and Caliper Logs',
  PFM000000021: 'Spontaneous Potential (SP) Log',
  PFM000000022: 'Resistivity Logs',
  PFM000000023: 'Density and Neutron Logs',
  PFM000000024: 'Sonic (Acoustic) Log',
  PFM000000025: 'Shale Volume Quantification',
  PFM000000026: 'Effective Porosity Determination',
  PFM000000027: 'Archie\'s Equation and Formation Factor',
  PFM000000028: 'Water and Oil Saturation Determination',
  PFM000000029: 'Cutoffs and Net Pay',
  PFM000000030: 'Zonation and Log Correlation',
  PFM000000031: 'Capillary Pressure Concepts',
  PFM000000032: 'Wettability and Free Water Level',
  PFM000000033: 'Capillary Pressure Measurement Methods',
  PFM000000034: 'Interpretation and the J-Function',
  PFM000000035: 'Relative Permeability Concepts',
  PFM000000036: 'Kr Curve Measurement and Applications',
  PFM000000037: 'OOIP and OGIP Calculations',
  PFM000000038: 'Data Inputs and Uncertainty',
  PFM000000039: 'Multidisciplinary Data Integration',
  PFM000000040: 'Quality Control and Presentation',
  PFM000000041: 'Well Interpretation Case Study',
  PFM000000042: 'Parametric Calculation Exercises',
  PFM000000043: 'Stages of Oil Recovery',
  PFM000000044: 'Recovery Factor',
  PFM000000045: 'Reservoir Drive Mechanisms',
  PFM000000046: 'Residual Oil Saturation (Sor)',
  PFM000000047: 'Classification of EOR Methods',
  PFM000000048: 'EOR Screening Criteria and Process',
  PFM000000049: 'Polymer Flooding Mechanisms',
  PFM000000050: 'Mobility Ratio and Sweep Efficiency',
  PFM000000051: 'Polymer Types and Properties',
  PFM000000052: 'Polymer Degradation and Rheology',
  PFM000000053: 'Polymer Injection Design',
  PFM000000054: 'Polymer Implementation and Case Studies',
  PFM000000055: 'Surfactant Flooding Mechanisms',
  PFM000000056: 'Surfactant Types and Formulation',
  PFM000000057: 'Alkaline Flooding Mechanisms',
  PFM000000058: 'ASP Formulation and Process',
  PFM000000059: 'Chemical EOR Field Implementation',
  PFM000000060: 'Economic and Risk Evaluation',
  PFM000000061: 'Steamflood and Cyclic Steam',
  PFM000000062: 'SAGD and In-Situ Combustion',
  PFM000000063: 'CO2 and Hydrocarbon Gas Injection',
  PFM000000064: 'Miscibility Mechanisms and Applications',
  PFM000000065: 'Comparison of EOR Methods',
  PFM000000066: 'Reservoir-Based Method Selection',
  PFM000000067: 'EOR Project Planning Stages',
  PFM000000068: 'Pilot Testing and Field Scale-Up',
  PFM000000069: 'EOR Project Economic Analysis',
  PFM000000070: 'Risk Management and HSE',
  PFM000000071: 'CEOR Field Case Studies',
  PFM000000072: 'EOR Trends and Future',
};

export const getPetroLevelTitle = (level, lang) => {
  if (lang !== 'en') return level.name;
  return ENGLISH_LEVEL_TITLES[level.id] || level.name;
};

export const getPetroSublevelTitle = (name, lang) => {
  if (lang !== 'en') return name;
  return String(name || '')
    .replace(/^Petrofisika/, 'Petrophysics')
    .replace(/^Migas Non-Konvensional/, 'Unconventional Oil and Gas')
    .replace(/^Uji Sumur dan Pengasaman/, 'Well Testing and Acidizing');
};

export const getPetroMaterialTitle = (material, lang) => {
  if (lang !== 'en') return material.information;
  return material.information_en || ENGLISH_MATERIAL_TITLES[material.id] || material.information;
};
