CITIES = {
    "Bengaluru": {
        "lat": 12.97,
        "lon": 77.59,
        "drainage": 35,
        "population_density": 4381,
        "green_cover": 18,
        "impervious_surface": 78,
        "neighborhoods": ["Koramangala", "Bellandur", "Whitefield", "Indiranagar", "Yelahanka", "Electronic City"],
        "recommendations": {
            "avoid": "Bellandur Lake Road (frequent overflow zone)",
            "evacuation": "Outer Ring Road (ORR) elevated corridors",
            "shelter": "BBMP Disaster Relief Center, Indiranagar",
            "emergency": "Karnataka State Disaster Helpline 1070"
        }
    },
    "Delhi": {
        "lat": 28.61,
        "lon": 77.20,
        "drainage": 28,
        "population_density": 11320,
        "green_cover": 12,
        "impervious_surface": 85,
        "neighborhoods": ["Okhla", "Vasant Kunj", "Dwarka", "Rohini", "Connaught Place", "Lajpat Nagar"],
        "recommendations": {
            "avoid": "ITO Intersection, Minto Bridge underpass",
            "evacuation": "Ring Road express routes",
            "shelter": "NDMC Community Center, Vasant Kunj",
            "emergency": "Delhi Disaster Management Authority 1077"
        }
    },
    "Chennai": {
        "lat": 13.08,
        "lon": 80.27,
        "drainage": 30,
        "population_density": 7088,
        "green_cover": 20,
        "impervious_surface": 82,
        "neighborhoods": ["Velachery", "T Nagar", "Anna Nagar", "Adyar", "Mylapore", "Guindy"],
        "recommendations": {
            "avoid": "Velachery low-lying sectors and Pallikaranai marsh edges",
            "evacuation": "OMR (Old Mahabalipuram Road) elevated sections",
            "shelter": "GCC Relief Camp, Anna Nagar",
            "emergency": "Tamil Nadu State Emergency Operation Centre 1070"
        }
    },
    "Mumbai": {
        "lat": 19.07,
        "lon": 72.87,
        "drainage": 25,
        "population_density": 12479,
        "green_cover": 15,
        "impervious_surface": 90,
        "neighborhoods": ["Andheri", "Bandra", "Colaba", "Dharavi", "Goregaon", "Juhu"],
        "recommendations": {
            "avoid": "Hindmata, Milan Subway, Andheri Subway",
            "evacuation": "Bandra-Worli Sea Link, Eastern Freeway",
            "shelter": "BMC Emergency Shelter, Bandra Kurla Complex",
            "emergency": "BMC Disaster Management Cell 1916"
        }
    },
    "Patna": {
        "lat": 25.59,
        "lon": 85.13,
        "drainage": 20,
        "population_density": 1803,
        "green_cover": 22,
        "impervious_surface": 65,
        "neighborhoods": ["Kankarbagh", "Rajendra Nagar", "Patliputra", "Danapur", "Boring Road", "Phulwari Sharif"],
        "recommendations": {
            "avoid": "Rajendra Nagar low-lying areas, Kankarbagh central",
            "evacuation": "Bailey Road elevated stretches",
            "shelter": "State Disaster Mitigation Center, Patliputra",
            "emergency": "Bihar SDMA Helpline 1070"
        }
    },
    "Guwahati": {
        "lat": 26.14,
        "lon": 91.73,
        "drainage": 18,
        "population_density": 4300,
        "green_cover": 25,
        "impervious_surface": 60,
        "neighborhoods": ["Dispur", "Fancy Bazar", "Maligaon", "Beltola", "Hatigaon", "Chandmari"],
        "recommendations": {
            "avoid": "Anil Nagar, Nabin Nagar, Tarun Nagar",
            "evacuation": "GS Road (Guwahati-Shillong Road) high terrain",
            "shelter": "ASDMA Relief Camp, Dispur",
            "emergency": "Assam State Disaster Management Authority 1070"
        }
    },
    "Kolkata": {
        "lat": 22.57,
        "lon": 88.36,
        "drainage": 22,
        "population_density": 24000,
        "green_cover": 16,
        "impervious_surface": 88,
        "neighborhoods": ["Salt Lake", "Park Street", "Ballygunge", "Howrah", "New Town", "Alipore"],
        "recommendations": {
            "avoid": "Central Avenue, Thanthania Kalibari stretch, Park Circus",
            "evacuation": "EM Bypass (Eastern Metropolitan Bypass)",
            "shelter": "KMC Safe House, Salt Lake Stadium",
            "emergency": "Kolkata Police Disaster Management 1070"
        }
    },
    "Ahmedabad": {
        "lat": 23.02,
        "lon": 72.57,
        "drainage": 35,
        "population_density": 12000,
        "green_cover": 12,
        "impervious_surface": 75,
        "neighborhoods": ["Bopal", "Navrangpura", "Satellite", "Maninagar", "Vastrapur", "Thaltej"],
        "recommendations": {
            "avoid": "Mithakhali underpass, Akhbarnagar underpass",
            "evacuation": "SG Highway (Sarkhej-Gandhinagar Highway)",
            "shelter": "AMC Community Hall, Satellite",
            "emergency": "Gujarat GSDMA Helpline 1070"
        }
    },
    "Surat": {
        "lat": 21.17,
        "lon": 72.83,
        "drainage": 30,
        "population_density": 13000,
        "green_cover": 10,
        "impervious_surface": 80,
        "neighborhoods": ["Adajan", "Vesu", "Varachha", "Piplod", "Katargam", "Udhna"],
        "recommendations": {
            "avoid": "Rander Road, areas adjacent to Tapi riverbanks",
            "evacuation": "Surat-Dumas Road elevated zones",
            "shelter": "SMC Disaster Camp, Vesu",
            "emergency": "Surat Municipal Corporation Helpline 1067"
        }
    },
    "Wayanad": {
        "lat": 11.68,
        "lon": 76.13,
        "drainage": 50,
        "population_density": 400,
        "green_cover": 65,
        "impervious_surface": 35,
        "neighborhoods": ["Kalpetta", "Mananthavady", "Sulthan Bathery", "Vythiri", "Meppadi", "Panamaram"],
        "recommendations": {
            "avoid": "Steep slopes in Meppadi, structurally weak valley roads",
            "evacuation": "NH 766 safe zones away from landslide prone hills",
            "shelter": "District Disaster Mitigation Shelter, Kalpetta",
            "emergency": "Kerala State Disaster Management Helpline 1077"
        }
    },
    "Kozhikode": {
        "lat": 11.25,
        "lon": 75.78,
        "drainage": 45,
        "population_density": 3400,
        "green_cover": 22,
        "impervious_surface": 55,
        "neighborhoods": ["Beypore", "West Hill", "Nallalam", "Pantheerankavu", "Chevayur"],
        "recommendations": {
            "avoid": "Low-lying coastal areas near Beypore, Mananchira square",
            "evacuation": "Mavoor Road higher terrain",
            "shelter": "Civil Station Relief Hub, Kozhikode",
            "emergency": "Kozhikode District Emergency Operations 1077"
        }
    }
}
