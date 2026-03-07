import sys

def calculate_risk_metrics(rainfall, temperature, humidity, population_density,
                           drainage_capacity, impervious_surface=50.0, elevation_index=0.3):
    """
    UrbanShield Risk Engine v3 — Calibrated for extreme Indian disaster scenarios.
    Matches predictionEngine.ts exactly.
    """
    # 1. Flood Score
    rain_score      = min(100, (rainfall / 300) * 100)
    drainage_stress = 100 - (drainage_capacity * 100 if drainage_capacity <= 1
                             else drainage_capacity)
    density_score   = min(50, (population_density / 25000) * 100)  # Cap: rural protection
    terrain_amp = (min(15, (elevation_index - 0.6) * 50)
                   if elevation_index > 0.6 and rainfall > 150 else 0)

    flood = ((rain_score * 0.40) + (drainage_stress * 0.24) +
             (density_score * 0.10) + (impervious_surface * 0.15) + terrain_amp)
    flood = round(min(100, max(0, flood)), 1)

    # 2. Heat Score — lethal escalation above 46C
    temp_factor      = ((temperature - 15) / 35) * 45
    temp_penalty     = (30 + (temperature - 46) * 4 if temperature > 46
                        else min(max(0, (temperature - 38) * 2.5), 30))
    humidity_penalty = max(0, (humidity - 70) * 0.5)
    heat = round(min(100, temp_factor + temp_penalty + humidity_penalty), 1)

    # 3. Compound — tiered dominant-hazard floor
    interaction   = (rainfall * temperature) / 2500
    weighted      = (flood * 0.55) + (heat * 0.35) + (interaction * 1.5)
    dominant_haz  = max(flood, heat)
    floor_mult    = 0.90 if dominant_haz >= 70 else 0.78
    compound      = max(weighted, dominant_haz * floor_mult)
    if flood > 65 and heat > 65:
        compound += 8
    compound = round(min(100, compound))

    cat = ('Critical' if compound >= 62 else
           'High'     if compound >= 38 else
           'Moderate' if compound >= 24 else 'Low')

    return {'flood': round(flood), 'heat': round(heat), 'compound': compound, 'category': cat}


# ---------------------------------------------------------------------------
# Scenario parameters use documented real-disaster rainfall values:
#   Mumbai 2005 flood: 944mm/day peak, test uses 280mm (hourly extreme)
#   Delhi 2024 heatwave: 49-50C recorded
#   Wayanad 2024 disaster: 200-400mm in 24h, test uses 280mm
#   Guwahati/Brahmaputra 2004/2022: 200-350mm events, test uses 260mm
#   Chennai 2015 flood: 300mm+ 24h rainfall, test uses 310mm
# ---------------------------------------------------------------------------
SCENARIOS = [
    ('Bengaluru — Dry Season',
     dict(rainfall=30,  temperature=28, humidity=50, population_density=4500,
          drainage_capacity=45, impervious_surface=50, elevation_index=0.35),
     'Low'),

    ('Bengaluru — Monsoon',
     dict(rainfall=120, temperature=26, humidity=80, population_density=4500,
          drainage_capacity=35, impervious_surface=55, elevation_index=0.35),
     'Moderate'),

    ('Mumbai — Extreme Flood (280mm)',
     dict(rainfall=280, temperature=29, humidity=90, population_density=21000,
          drainage_capacity=20, impervious_surface=75, elevation_index=0.15),
     'Critical'),

    ('Delhi — 49C Lethal Heatwave',
     dict(rainfall=5,   temperature=49, humidity=25, population_density=11000,
          drainage_capacity=50, impervious_surface=60, elevation_index=0.2),
     'Critical'),

    ('Wayanad — Landslide Conditions',
     dict(rainfall=280, temperature=27, humidity=95, population_density=400,
          drainage_capacity=10, impervious_surface=30, elevation_index=0.85),
     'Critical'),

    ('Guwahati — Brahmaputra Flood',
     dict(rainfall=260, temperature=30, humidity=85, population_density=3200,
          drainage_capacity=15, impervious_surface=50, elevation_index=0.2),
     'Critical'),

    ('Chennai — Mega Flood',
     dict(rainfall=310, temperature=30, humidity=88, population_density=7000,
          drainage_capacity=15, impervious_surface=65, elevation_index=0.1),
     'Critical'),

    ('Patna — Calm Conditions',
     dict(rainfall=20,  temperature=27, humidity=55, population_density=3200,
          drainage_capacity=50, impervious_surface=45, elevation_index=0.25),
     'Low'),
]


if __name__ == '__main__':
    SEP = '=' * 70
    print(SEP)
    print('  UrbanShield Disaster Engine -- Scenario Validation Suite')
    print(SEP)
    all_pass = True
    for name, args, expected in SCENARIOS:
        r   = calculate_risk_metrics(**args)
        ok  = r['category'] == expected
        if not ok:
            all_pass = False
        tag = 'PASS' if ok else 'FAIL'
        print('[{}] {}'.format(tag, name))
        print('     Flood={:>3d}  Heat={:>3d}  Compound={:>3d}  -> {}  (expected: {})'.format(
            r['flood'], r['heat'], r['compound'], r['category'], expected))
    print(SEP)
    print('  Result: ALL SCENARIOS PASSED' if all_pass else '  Result: FAILURES FOUND')
    print(SEP)
    sys.exit(0 if all_pass else 1)
