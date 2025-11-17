# Vehicle Pricing Analysis & Update Plan

## Current Pricing System

The application currently uses **algorithmic/estimated pricing** rather than real MSRP data. There are two main pricing systems:

### 1. **vehicleSpecs.ts** - Base MSRP Pricing
Located at: `src/utils/vehicleSpecs.ts`

Current estimated base prices:
- **Entry-level** (Civic, Corolla): ~$24,000
- **Mid-range sedans** (Camry, Accord): ~$28,000
- **Performance** (Mustang, Camaro, Challenger): ~$38,000
- **Subaru WRX**: ~$30,000
- **German luxury** (BMW, Mercedes, Audi): ~$45,000
- **Tesla EVs**: ~$40,000-55,000
- **Trucks** (F-150, Silverado): ~$35,000

### 2. **vehicleListings.ts** - Used Car Pricing
Located at: `src/utils/vehicleListings.ts`

Uses depreciation algorithm (15% first 3 years, 10% thereafter)

## Vehicles in Database

### **Mass Market Brands** (~180+ vehicles)
- Honda: Civic, Accord, CR-V, Passport, Pilot, Ridgeline, HR-V
- Toyota: Camry, Corolla, RAV4, Tacoma, Tundra, 4Runner, Highlander, Prius, Supra
- Nissan: Altima, Sentra, Titan
- Ford: Mustang, F-150, Explorer, Escape, Edge, Bronco, Bronco Sport, Ranger, Maverick
- Chevrolet: Camaro, Silverado, Corvette, Colorado, Traverse
- Subaru: WRX, WRX STI, BRZ, Impreza, Legacy, Outback, Forester, Ascent, Crosstrek
- Mazda: Mazda3, Mazda6, CX-5, CX-30
- Hyundai: Sonata, Elantra, Santa Fe, Ioniq 5, Ioniq 6
- Kia: Stinger, Forte/K4, Sorento, EV9
- Volkswagen: Jetta
- Dodge: Challenger
- GMC: Sierra
- Ram: 1500
- Jeep: Wrangler

### **Luxury Brands** (~60+ vehicles)
- **BMW**: 3 Series, 7 Series, M2, M3, i4
- **Mercedes**: C-Class, S-Class, SL680 Maybach
- **Audi**: A4, A8, RS 5
- **Lexus**: IS, LS
- **Acura**: TLX, ADX
- **Infiniti**: Q50
- **Genesis**: G70, G90
- **Volvo**: S60
- **Cadillac**: CT4, CT6, Optiq
- **Jaguar**: XE
- **Alfa Romeo**: Giulia
- **Land Rover**: Defender
- **MINI**: Cooper

### **Ultra-Luxury / High-Performance** (~20 vehicles)
- **Porsche**: 911, Panamera, Taycan
- **Bentley**: Flying Spur, **Continental GT Supersports** ⭐
- **Rolls-Royce**: Ghost
- **Tesla**: Model 3, Model S, Model Y
- **Rivian**: R1T, R2
- **Ford**: F-150 Lightning
- **Chevrolet**: Corvette (including Z06)

## Priority Vehicles Needing Real Pricing

### 🔴 **CRITICAL - Ultra-Luxury (Missing/Way Off)**

1. **2026 Bentley Continental GT Supersports** ⭐ NEW
   - Current: Using default ~$45,000
   - Real MSRP: **~$300,000+**
   - Status: **NEEDS IMMEDIATE UPDATE**

2. **2021-2025 Bentley Flying Spur**
   - Current: ~$45,000
   - Real MSRP: **$214,600 - $250,000**

3. **2021-2025 Rolls-Royce Ghost**
   - Current: ~$45,000
   - Real MSRP: **$340,000 - $400,000**

4. **2021-2026 Mercedes-Maybach SL680**
   - Current: ~$50,000
   - Real MSRP: **$245,000+**

### 🟡 **HIGH PRIORITY - Performance/Luxury**

5. **2021-2025 Porsche 911**
   - Current: ~$45,000
   - Real MSRP: **$115,000 - $220,000+** (varies by trim)

6. **2021-2025 Porsche Taycan**
   - Current: ~$45,000
   - Real MSRP: **$90,000 - $185,000**

7. **2021-2025 Porsche Panamera**
   - Current: ~$45,000
   - Real MSRP: **$95,000 - $200,000**

8. **2025 Chevrolet Corvette Z06**
   - Current: ~$38,000 base Corvette pricing
   - Real MSRP: **$112,000 - $140,000+**

9. **2021-2025 BMW M3**
   - Current: ~$45,000
   - Real MSRP: **$73,000 - $120,000**

10. **2020-2026 BMW M2 / M2 CS**
    - Current: ~$45,000
    - Real MSRP: **$64,000 - $75,000**

11. **2021-2025 Audi RS 5**
    - Current: ~$42,000
    - Real MSRP: **$77,000 - $85,000**

12. **2021-2025 Land Rover Defender**
    - Current: ~$32,000
    - Real MSRP: **$57,000 - $100,000+**

### 🟢 **MEDIUM PRIORITY - EVs**

13. **2021-2025 Tesla Model S**
    - Current: ~$55,000
    - Real MSRP: **$76,000 - $91,000** (after price cuts)

14. **2021-2025 Tesla Model Y**
    - Current: ~$55,000
    - Real MSRP: **$44,000 - $54,000**

15. **2021-2025 Tesla Model 3**
    - Current: ~$40,000
    - Real MSRP: **$40,000 - $53,000** ✅ (Close!)

16. **2021-2025 Rivian R1T**
    - Current: ~$28,000
    - Real MSRP: **$73,000 - $95,000**

17. **2024-2026 Rivian R2**
    - Current: ~$28,000
    - Real MSRP: **$45,000 - $50,000** (announced)

18. **2021-2025 Ford F-150 Lightning**
    - Current: ~$35,000
    - Real MSRP: **$62,000 - $97,000**

19. **2025-2026 Cadillac Optiq**
    - Current: ~$45,000
    - Real MSRP: **$54,000 - $60,000**

20. **2021-2026 Hyundai Ioniq 5**
    - Current: ~$22,000
    - Real MSRP: **$42,000 - $57,000**

21. **2021-2026 Hyundai Ioniq 6**
    - Current: ~$22,000
    - Real MSRP: **$37,000 - $52,000**

22. **2024 Kia EV9**
    - Current: ~$21,000
    - Real MSRP: **$56,000 - $73,000**

## Vehicles That Are Reasonably Close

These have acceptable pricing estimates:
- ✅ Honda Civic: $24,000 (Real: $24,000 - $30,000)
- ✅ Toyota Camry: $28,000 (Real: $28,000 - $37,000)
- ✅ Ford F-150: $35,000 (Real: $36,000 - $75,000+)
- ✅ Subaru WRX: $30,000 (Real: $30,000 - $43,000)
- ✅ Ford Mustang: $38,000 (Real: $30,000 - $82,000)

## Recommendation

**I need help with real MSRP pricing for:**

### **Top 10 Most Critical** (Completely Wrong)
1. 2026 Bentley Continental GT Supersports
2. Bentley Flying Spur
3. Rolls-Royce Ghost
4. Mercedes-Maybach SL680
5. Porsche 911
6. Porsche Taycan
7. Porsche Panamera
8. Chevrolet Corvette Z06
9. Rivian R1T
10. Ford F-150 Lightning

### **Next 10 Important** (Significantly Off)
11. BMW M3
12. BMW M2/M2 CS
13. Audi RS 5
14. Land Rover Defender
15. Hyundai Ioniq 5
16. Hyundai Ioniq 6
17. Kia EV9
18. Rivian R2
19. Tesla Model S
20. Tesla Model Y

---

**Would you like to provide the real MSRP data for these vehicles?** I can then update the `vehicleSpecs.ts` file with accurate pricing logic.

