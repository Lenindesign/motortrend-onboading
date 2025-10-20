/**
 * Vehicle Search Component
 * Reusable car search with autocomplete functionality
 */

import React, { useState, useRef, useEffect } from 'react';
import Icon from '../Icon';
import './VehicleSearch.css';

// Car database for autocomplete
const carDatabase = [
  '2015 Subaru WRX', '2021 Subaru WRX', '2018 Subaru WRX', '2017 Subaru WRX', '2024 Subaru WRX', '2022 Subaru WRX',
  '2020 Honda Civic', '2021 Honda Civic', '2022 Honda Civic', '2023 Honda Civic', '2024 Honda Civic',
  '2019 Toyota Camry', '2020 Toyota Camry', '2021 Toyota Camry', '2022 Toyota Camry', '2023 Toyota Camry', '2024 Toyota Camry',
  '2020 Ford Mustang', '2021 Ford Mustang', '2022 Ford Mustang', '2023 Ford Mustang', '2024 Ford Mustang',
  '2021 Tesla Model 3', '2022 Tesla Model 3', '2023 Tesla Model 3', '2024 Tesla Model 3',
  '2020 BMW 3 Series', '2021 BMW 3 Series', '2022 BMW 3 Series', '2023 BMW 3 Series', '2024 BMW 3 Series',
  '2019 Audi A4', '2020 Audi A4', '2021 Audi A4', '2022 Audi A4', '2023 Audi A4', '2024 Audi A4',
  '2020 Mercedes C-Class', '2021 Mercedes C-Class', '2022 Mercedes C-Class', '2023 Mercedes C-Class', '2024 Mercedes C-Class',
  '2021 Nissan Altima', '2022 Nissan Altima', '2023 Nissan Altima', '2024 Nissan Altima',
  '2020 Chevrolet Camaro', '2021 Chevrolet Camaro', '2022 Chevrolet Camaro', '2023 Chevrolet Camaro', '2024 Chevrolet Camaro',
  '2021 Dodge Challenger', '2022 Dodge Challenger', '2023 Dodge Challenger', '2024 Dodge Challenger',
  '2020 Lexus IS', '2021 Lexus IS', '2022 Lexus IS', '2023 Lexus IS', '2024 Lexus IS',
  '2021 Infiniti Q50', '2022 Infiniti Q50', '2023 Infiniti Q50', '2024 Infiniti Q50',
  '2020 Acura TLX', '2021 Acura TLX', '2022 Acura TLX', '2023 Acura TLX', '2024 Acura TLX',
  '2021 Genesis G70', '2022 Genesis G70', '2023 Genesis G70', '2024 Genesis G70',
  '2020 Volvo S60', '2021 Volvo S60', '2022 Volvo S60', '2023 Volvo S60', '2024 Volvo S60',
  '2021 Cadillac CT4', '2022 Cadillac CT4', '2023 Cadillac CT4', '2024 Cadillac CT4',
  '2020 Jaguar XE', '2021 Jaguar XE', '2022 Jaguar XE', '2023 Jaguar XE', '2024 Jaguar XE',
  '2021 Alfa Romeo Giulia', '2022 Alfa Romeo Giulia', '2023 Alfa Romeo Giulia', '2024 Alfa Romeo Giulia',
  '2020 Kia Stinger', '2021 Kia Stinger', '2022 Kia Stinger', '2023 Kia Stinger', '2024 Kia Stinger',
  '2021 Hyundai Sonata', '2022 Hyundai Sonata', '2023 Hyundai Sonata', '2024 Hyundai Sonata',
  '2020 Mazda6', '2021 Mazda6', '2022 Mazda6', '2023 Mazda6', '2024 Mazda6',
  '2020 Subaru Legacy', '2021 Subaru Legacy', '2022 Subaru Legacy', '2023 Subaru Legacy', '2024 Subaru Legacy',
  '2020 Subaru Impreza', '2021 Subaru Impreza', '2022 Subaru Impreza', '2023 Subaru Impreza', '2024 Subaru Impreza',
  '2020 Subaru Outback', '2021 Subaru Outback', '2022 Subaru Outback', '2023 Subaru Outback', '2024 Subaru Outback',
  '2020 Subaru Forester', '2021 Subaru Forester', '2022 Subaru Forester', '2023 Subaru Forester', '2024 Subaru Forester',
  '2020 Subaru Ascent', '2021 Subaru Ascent', '2022 Subaru Ascent', '2023 Subaru Ascent', '2024 Subaru Ascent',
  '2020 Subaru Crosstrek', '2021 Subaru Crosstrek', '2022 Subaru Crosstrek', '2023 Subaru Crosstrek', '2024 Subaru Crosstrek',
  '2020 Subaru BRZ', '2021 Subaru BRZ', '2022 Subaru BRZ', '2023 Subaru BRZ', '2024 Subaru BRZ',
  '2020 Subaru WRX STI', '2021 Subaru WRX STI', '2022 Subaru WRX STI', '2023 Subaru WRX STI', '2024 Subaru WRX STI',
  '2020 Ford F-150', '2021 Ford F-150', '2022 Ford F-150', '2023 Ford F-150', '2024 Ford F-150',
  '2020 Ford Explorer', '2021 Ford Explorer', '2022 Ford Explorer', '2023 Ford Explorer', '2024 Ford Explorer',
  '2020 Ford Escape', '2021 Ford Escape', '2022 Ford Escape', '2023 Ford Escape', '2024 Ford Escape',
  '2020 Ford Edge', '2021 Ford Edge', '2022 Ford Edge', '2023 Ford Edge', '2024 Ford Edge',
  '2020 Ford Bronco', '2021 Ford Bronco', '2022 Ford Bronco', '2023 Ford Bronco', '2024 Ford Bronco',
  '2020 Ford Bronco Sport', '2021 Ford Bronco Sport', '2022 Ford Bronco Sport', '2023 Ford Bronco Sport', '2024 Ford Bronco Sport',
  '2020 Ford Ranger', '2021 Ford Ranger', '2022 Ford Ranger', '2023 Ford Ranger', '2024 Ford Ranger',
  '2020 Ford Maverick', '2021 Ford Maverick', '2022 Ford Maverick', '2023 Ford Maverick', '2024 Ford Maverick',
  '2020 Chevrolet Silverado', '2021 Chevrolet Silverado', '2022 Chevrolet Silverado', '2023 Chevrolet Silverado', '2024 Chevrolet Silverado',
  '2020 Chevrolet Equinox', '2021 Chevrolet Equinox', '2022 Chevrolet Equinox', '2023 Chevrolet Equinox', '2024 Chevrolet Equinox',
  '2020 Chevrolet Traverse', '2021 Chevrolet Traverse', '2022 Chevrolet Traverse', '2023 Chevrolet Traverse', '2024 Chevrolet Traverse',
  '2020 Chevrolet Tahoe', '2021 Chevrolet Tahoe', '2022 Chevrolet Tahoe', '2023 Chevrolet Tahoe', '2024 Chevrolet Tahoe',
  '2020 Chevrolet Suburban', '2021 Chevrolet Suburban', '2022 Chevrolet Suburban', '2023 Chevrolet Suburban', '2024 Chevrolet Suburban',
  '2020 Chevrolet Colorado', '2021 Chevrolet Colorado', '2022 Chevrolet Colorado', '2023 Chevrolet Colorado', '2024 Chevrolet Colorado',
  '2020 Chevrolet Blazer', '2021 Chevrolet Blazer', '2022 Chevrolet Blazer', '2023 Chevrolet Blazer', '2024 Chevrolet Blazer',
  '2020 Chevrolet Malibu', '2021 Chevrolet Malibu', '2022 Chevrolet Malibu', '2023 Chevrolet Malibu', '2024 Chevrolet Malibu',
  '2020 GMC Sierra', '2021 GMC Sierra', '2022 GMC Sierra', '2023 GMC Sierra', '2024 GMC Sierra',
  '2020 GMC Yukon', '2021 GMC Yukon', '2022 GMC Yukon', '2023 GMC Yukon', '2024 GMC Yukon',
  '2020 GMC Acadia', '2021 GMC Acadia', '2022 GMC Acadia', '2023 GMC Acadia', '2024 GMC Acadia',
  '2020 GMC Terrain', '2021 GMC Terrain', '2022 GMC Terrain', '2023 GMC Terrain', '2024 GMC Terrain',
  '2020 GMC Canyon', '2021 GMC Canyon', '2022 GMC Canyon', '2023 GMC Canyon', '2024 GMC Canyon',
  '2020 Ram 1500', '2021 Ram 1500', '2022 Ram 1500', '2023 Ram 1500', '2024 Ram 1500',
  '2020 Ram 2500', '2021 Ram 2500', '2022 Ram 2500', '2023 Ram 2500', '2024 Ram 2500',
  '2020 Ram 3500', '2021 Ram 3500', '2022 Ram 3500', '2023 Ram 3500', '2024 Ram 3500',
  '2020 Jeep Wrangler', '2021 Jeep Wrangler', '2022 Jeep Wrangler', '2023 Jeep Wrangler', '2024 Jeep Wrangler',
  '2020 Jeep Grand Cherokee', '2021 Jeep Grand Cherokee', '2022 Jeep Grand Cherokee', '2023 Jeep Grand Cherokee', '2024 Jeep Grand Cherokee',
  '2020 Jeep Cherokee', '2021 Jeep Cherokee', '2022 Jeep Cherokee', '2023 Jeep Cherokee', '2024 Jeep Cherokee',
  '2020 Jeep Compass', '2021 Jeep Compass', '2022 Jeep Compass', '2023 Jeep Compass', '2024 Jeep Compass',
  '2020 Jeep Renegade', '2021 Jeep Renegade', '2022 Jeep Renegade', '2023 Jeep Renegade', '2024 Jeep Renegade',
  '2020 Jeep Gladiator', '2021 Jeep Gladiator', '2022 Jeep Gladiator', '2023 Jeep Gladiator', '2024 Jeep Gladiator',
  '2020 Jeep Grand Wagoneer', '2021 Jeep Grand Wagoneer', '2022 Jeep Grand Wagoneer', '2023 Jeep Grand Wagoneer', '2024 Jeep Grand Wagoneer',
  '2020 Jeep Wagoneer', '2021 Jeep Wagoneer', '2022 Jeep Wagoneer', '2023 Jeep Wagoneer', '2024 Jeep Wagoneer',
  '2020 Toyota RAV4', '2021 Toyota RAV4', '2022 Toyota RAV4', '2023 Toyota RAV4', '2024 Toyota RAV4',
  '2020 Toyota Highlander', '2021 Toyota Highlander', '2022 Toyota Highlander', '2023 Toyota Highlander', '2024 Toyota Highlander',
  '2020 Toyota 4Runner', '2021 Toyota 4Runner', '2022 Toyota 4Runner', '2023 Toyota 4Runner', '2024 Toyota 4Runner',
  '2020 Toyota Tacoma', '2021 Toyota Tacoma', '2022 Toyota Tacoma', '2023 Toyota Tacoma', '2024 Toyota Tacoma',
  '2020 Toyota Tundra', '2021 Toyota Tundra', '2022 Toyota Tundra', '2023 Toyota Tundra', '2024 Toyota Tundra',
  '2020 Toyota Sequoia', '2021 Toyota Sequoia', '2022 Toyota Sequoia', '2023 Toyota Sequoia', '2024 Toyota Sequoia',
  '2020 Toyota Land Cruiser', '2021 Toyota Land Cruiser', '2022 Toyota Land Cruiser', '2023 Toyota Land Cruiser', '2024 Toyota Land Cruiser',
  '2020 Toyota Prius', '2021 Toyota Prius', '2022 Toyota Prius', '2023 Toyota Prius', '2024 Toyota Prius',
  '2020 Toyota Corolla', '2021 Toyota Corolla', '2022 Toyota Corolla', '2023 Toyota Corolla', '2024 Toyota Corolla',
  '2020 Toyota Avalon', '2021 Toyota Avalon', '2022 Toyota Avalon', '2023 Toyota Avalon', '2024 Toyota Avalon',
  '2020 Honda Accord', '2021 Honda Accord', '2022 Honda Accord', '2023 Honda Accord', '2024 Honda Accord',
  '2020 Honda CR-V', '2021 Honda CR-V', '2022 Honda CR-V', '2023 Honda CR-V', '2024 Honda CR-V',
  '2020 Honda Pilot', '2021 Honda Pilot', '2022 Honda Pilot', '2023 Honda Pilot', '2024 Honda Pilot',
  '2020 Honda Passport', '2021 Honda Passport', '2022 Honda Passport', '2023 Honda Passport', '2024 Honda Passport',
  '2020 Honda Ridgeline', '2021 Honda Ridgeline', '2022 Honda Ridgeline', '2023 Honda Ridgeline', '2024 Honda Ridgeline',
  '2020 Honda HR-V', '2021 Honda HR-V', '2022 Honda HR-V', '2023 Honda HR-V', '2024 Honda HR-V',
  '2020 Honda Insight', '2021 Honda Insight', '2022 Honda Insight', '2023 Honda Insight', '2024 Honda Insight',
  '2020 Honda Fit', '2021 Honda Fit', '2022 Honda Fit', '2023 Honda Fit', '2024 Honda Fit',
  '2020 Nissan Rogue', '2021 Nissan Rogue', '2022 Nissan Rogue', '2023 Nissan Rogue', '2024 Nissan Rogue',
  '2020 Nissan Murano', '2021 Nissan Murano', '2022 Nissan Murano', '2023 Nissan Murano', '2024 Nissan Murano',
  '2020 Nissan Pathfinder', '2021 Nissan Pathfinder', '2022 Nissan Pathfinder', '2023 Nissan Pathfinder', '2024 Nissan Pathfinder',
  '2020 Nissan Armada', '2021 Nissan Armada', '2022 Nissan Armada', '2023 Nissan Armada', '2024 Nissan Armada',
  '2020 Nissan Frontier', '2021 Nissan Frontier', '2022 Nissan Frontier', '2023 Nissan Frontier', '2024 Nissan Frontier',
  '2020 Nissan Titan', '2021 Nissan Titan', '2022 Nissan Titan', '2023 Nissan Titan', '2024 Nissan Titan',
  '2020 Nissan Sentra', '2021 Nissan Sentra', '2022 Nissan Sentra', '2023 Nissan Sentra', '2024 Nissan Sentra',
  '2020 Nissan Versa', '2021 Nissan Versa', '2022 Nissan Versa', '2023 Nissan Versa', '2024 Nissan Versa',
  '2020 Nissan Maxima', '2021 Nissan Maxima', '2022 Nissan Maxima', '2023 Nissan Maxima', '2024 Nissan Maxima',
  '2020 Nissan 370Z', '2021 Nissan 370Z', '2022 Nissan 370Z', '2023 Nissan 370Z', '2024 Nissan 370Z',
  '2020 Nissan GT-R', '2021 Nissan GT-R', '2022 Nissan GT-R', '2023 Nissan GT-R', '2024 Nissan GT-R',
  '2020 Nissan Leaf', '2021 Nissan Leaf', '2022 Nissan Leaf', '2023 Nissan Leaf', '2024 Nissan Leaf',
  '2020 Nissan Ariya', '2021 Nissan Ariya', '2022 Nissan Ariya', '2023 Nissan Ariya', '2024 Nissan Ariya',
  '2020 Hyundai Tucson', '2021 Hyundai Tucson', '2022 Hyundai Tucson', '2023 Hyundai Tucson', '2024 Hyundai Tucson',
  '2020 Hyundai Santa Fe', '2021 Hyundai Santa Fe', '2022 Hyundai Santa Fe', '2023 Hyundai Santa Fe', '2024 Hyundai Santa Fe',
  '2020 Hyundai Palisade', '2021 Hyundai Palisade', '2022 Hyundai Palisade', '2023 Hyundai Palisade', '2024 Hyundai Palisade',
  '2020 Hyundai Kona', '2021 Hyundai Kona', '2022 Hyundai Kona', '2023 Hyundai Kona', '2024 Hyundai Kona',
  '2020 Hyundai Venue', '2021 Hyundai Venue', '2022 Hyundai Venue', '2023 Hyundai Venue', '2024 Hyundai Venue',
  '2020 Hyundai Elantra', '2021 Hyundai Elantra', '2022 Hyundai Elantra', '2023 Hyundai Elantra', '2024 Hyundai Elantra',
  '2020 Hyundai Veloster', '2021 Hyundai Veloster', '2022 Hyundai Veloster', '2023 Hyundai Veloster', '2024 Hyundai Veloster',
  '2020 Hyundai Ioniq', '2021 Hyundai Ioniq', '2022 Hyundai Ioniq', '2023 Hyundai Ioniq', '2024 Hyundai Ioniq',
  '2020 Hyundai Nexo', '2021 Hyundai Nexo', '2022 Hyundai Nexo', '2023 Hyundai Nexo', '2024 Hyundai Nexo',
  '2020 Kia Sportage', '2021 Kia Sportage', '2022 Kia Sportage', '2023 Kia Sportage', '2024 Kia Sportage',
  '2020 Kia Sorento', '2021 Kia Sorento', '2022 Kia Sorento', '2023 Kia Sorento', '2024 Kia Sorento',
  '2020 Kia Telluride', '2021 Kia Telluride', '2022 Kia Telluride', '2023 Kia Telluride', '2024 Kia Telluride',
  '2020 Kia Soul', '2021 Kia Soul', '2022 Kia Soul', '2023 Kia Soul', '2024 Kia Soul',
  '2020 Kia Forte', '2021 Kia Forte', '2022 Kia Forte', '2023 Kia Forte', '2024 Kia Forte',
  '2020 Kia Optima', '2021 Kia Optima', '2022 Kia Optima', '2023 Kia Optima', '2024 Kia Optima',
  '2020 Kia Niro', '2021 Kia Niro', '2022 Kia Niro', '2023 Kia Niro', '2024 Kia Niro',
  '2020 Kia EV6', '2021 Kia EV6', '2022 Kia EV6', '2023 Kia EV6', '2024 Kia EV6',
  '2020 Mazda CX-5', '2021 Mazda CX-5', '2022 Mazda CX-5', '2023 Mazda CX-5', '2024 Mazda CX-5',
  '2020 Mazda CX-9', '2021 Mazda CX-9', '2022 Mazda CX-9', '2023 Mazda CX-9', '2024 Mazda CX-9',
  '2020 Mazda CX-30', '2021 Mazda CX-30', '2022 Mazda CX-30', '2023 Mazda CX-30', '2024 Mazda CX-30',
  '2020 Mazda CX-50', '2021 Mazda CX-50', '2022 Mazda CX-50', '2023 Mazda CX-50', '2024 Mazda CX-50',
  '2020 Mazda3', '2021 Mazda3', '2022 Mazda3', '2023 Mazda3', '2024 Mazda3',
  '2020 Mazda CX-3', '2021 Mazda CX-3', '2022 Mazda CX-3', '2023 Mazda CX-3', '2024 Mazda CX-3',
  '2020 Mazda MX-5 Miata', '2021 Mazda MX-5 Miata', '2022 Mazda MX-5 Miata', '2023 Mazda MX-5 Miata', '2024 Mazda MX-5 Miata',
  '2020 Mazda MX-30', '2021 Mazda MX-30', '2022 Mazda MX-30', '2023 Mazda MX-30', '2024 Mazda MX-30',
  '2020 Volkswagen Jetta', '2021 Volkswagen Jetta', '2022 Volkswagen Jetta', '2023 Volkswagen Jetta', '2024 Volkswagen Jetta',
  '2020 Volkswagen Passat', '2021 Volkswagen Passat', '2022 Volkswagen Passat', '2023 Volkswagen Passat', '2024 Volkswagen Passat',
  '2020 Volkswagen Golf', '2021 Volkswagen Golf', '2022 Volkswagen Golf', '2023 Volkswagen Golf', '2024 Volkswagen Golf',
  '2020 Volkswagen Tiguan', '2021 Volkswagen Tiguan', '2022 Volkswagen Tiguan', '2023 Volkswagen Tiguan', '2024 Volkswagen Tiguan',
  '2020 Volkswagen Atlas', '2021 Volkswagen Atlas', '2022 Volkswagen Atlas', '2023 Volkswagen Atlas', '2024 Volkswagen Atlas',
  '2020 Volkswagen ID.4', '2021 Volkswagen ID.4', '2022 Volkswagen ID.4', '2023 Volkswagen ID.4', '2024 Volkswagen ID.4',
  '2020 Volkswagen Arteon', '2021 Volkswagen Arteon', '2022 Volkswagen Arteon', '2023 Volkswagen Arteon', '2024 Volkswagen Arteon',
  '2020 Volkswagen CC', '2021 Volkswagen CC', '2022 Volkswagen CC', '2023 Volkswagen CC', '2024 Volkswagen CC',
  '2020 Volkswagen Beetle', '2021 Volkswagen Beetle', '2022 Volkswagen Beetle', '2023 Volkswagen Beetle', '2024 Volkswagen Beetle',
  '2020 Volkswagen Touareg', '2021 Volkswagen Touareg', '2022 Volkswagen Touareg', '2023 Volkswagen Touareg', '2024 Volkswagen Touareg',
  '2020 Volkswagen Phaeton', '2021 Volkswagen Phaeton', '2022 Volkswagen Phaeton', '2023 Volkswagen Phaeton', '2024 Volkswagen Phaeton',
  '2020 Volkswagen Eos', '2021 Volkswagen Eos', '2022 Volkswagen Eos', '2023 Volkswagen Eos', '2024 Volkswagen Eos',
  '2020 Volkswagen Routan', '2021 Volkswagen Routan', '2022 Volkswagen Routan', '2023 Volkswagen Routan', '2024 Volkswagen Routan',
  '2020 Volkswagen Rabbit', '2021 Volkswagen Rabbit', '2022 Volkswagen Rabbit', '2023 Volkswagen Rabbit', '2024 Volkswagen Rabbit',
  '2020 Volkswagen Cabrio', '2021 Volkswagen Cabrio', '2022 Volkswagen Cabrio', '2023 Volkswagen Cabrio', '2024 Volkswagen Cabrio',
  '2020 Volkswagen Corrado', '2021 Volkswagen Corrado', '2022 Volkswagen Corrado', '2023 Volkswagen Corrado', '2024 Volkswagen Corrado',
  '2020 Volkswagen Scirocco', '2021 Volkswagen Scirocco', '2022 Volkswagen Scirocco', '2023 Volkswagen Scirocco', '2024 Volkswagen Scirocco',
  '2020 Volkswagen Karmann Ghia', '2021 Volkswagen Karmann Ghia', '2022 Volkswagen Karmann Ghia', '2023 Volkswagen Karmann Ghia', '2024 Volkswagen Karmann Ghia',
  '2020 Volkswagen Type 2', '2021 Volkswagen Type 2', '2022 Volkswagen Type 2', '2023 Volkswagen Type 2', '2024 Volkswagen Type 2',
  '2020 Volkswagen Type 3', '2021 Volkswagen Type 3', '2022 Volkswagen Type 3', '2023 Volkswagen Type 3', '2024 Volkswagen Type 3',
  '2020 Volkswagen Type 4', '2021 Volkswagen Type 4', '2022 Volkswagen Type 4', '2023 Volkswagen Type 4', '2024 Volkswagen Type 4',
  '2020 Volkswagen Type 14', '2021 Volkswagen Type 14', '2022 Volkswagen Type 14', '2023 Volkswagen Type 14', '2024 Volkswagen Type 14',
  '2020 Volkswagen Type 15', '2021 Volkswagen Type 15', '2022 Volkswagen Type 15', '2023 Volkswagen Type 15', '2024 Volkswagen Type 15',
  '2020 Volkswagen Type 16', '2021 Volkswagen Type 16', '2022 Volkswagen Type 16', '2023 Volkswagen Type 16', '2024 Volkswagen Type 16',
  '2020 Volkswagen Type 17', '2021 Volkswagen Type 17', '2022 Volkswagen Type 17', '2023 Volkswagen Type 17', '2024 Volkswagen Type 17',
  '2020 Volkswagen Type 18', '2021 Volkswagen Type 18', '2022 Volkswagen Type 18', '2023 Volkswagen Type 18', '2024 Volkswagen Type 18',
  '2020 Volkswagen Type 19', '2021 Volkswagen Type 19', '2022 Volkswagen Type 19', '2023 Volkswagen Type 19', '2024 Volkswagen Type 19',
  '2020 Volkswagen Type 20', '2021 Volkswagen Type 20', '2022 Volkswagen Type 20', '2023 Volkswagen Type 20', '2024 Volkswagen Type 20',
  '2020 Volkswagen Type 21', '2021 Volkswagen Type 21', '2022 Volkswagen Type 21', '2023 Volkswagen Type 21', '2024 Volkswagen Type 21',
  '2020 Volkswagen Type 22', '2021 Volkswagen Type 22', '2022 Volkswagen Type 22', '2023 Volkswagen Type 22', '2024 Volkswagen Type 22',
  '2020 Volkswagen Type 23', '2021 Volkswagen Type 23', '2022 Volkswagen Type 23', '2023 Volkswagen Type 23', '2024 Volkswagen Type 23',
  '2020 Volkswagen Type 24', '2021 Volkswagen Type 24', '2022 Volkswagen Type 24', '2023 Volkswagen Type 24', '2024 Volkswagen Type 24',
  '2020 Volkswagen Type 25', '2021 Volkswagen Type 25', '2022 Volkswagen Type 25', '2023 Volkswagen Type 25', '2024 Volkswagen Type 25',
  '2020 Volkswagen Type 26', '2021 Volkswagen Type 26', '2022 Volkswagen Type 26', '2023 Volkswagen Type 26', '2024 Volkswagen Type 26',
  '2020 Volkswagen Type 27', '2021 Volkswagen Type 27', '2022 Volkswagen Type 27', '2023 Volkswagen Type 27', '2024 Volkswagen Type 27',
  '2020 Volkswagen Type 28', '2021 Volkswagen Type 28', '2022 Volkswagen Type 28', '2023 Volkswagen Type 28', '2024 Volkswagen Type 28',
  '2020 Volkswagen Type 29', '2021 Volkswagen Type 29', '2022 Volkswagen Type 29', '2023 Volkswagen Type 29', '2024 Volkswagen Type 29',
  '2020 Volkswagen Type 30', '2021 Volkswagen Type 30', '2022 Volkswagen Type 30', '2023 Volkswagen Type 30', '2024 Volkswagen Type 30',
  '2020 Volkswagen Type 31', '2021 Volkswagen Type 31', '2022 Volkswagen Type 31', '2023 Volkswagen Type 31', '2024 Volkswagen Type 31',
  '2020 Volkswagen Type 32', '2021 Volkswagen Type 32', '2022 Volkswagen Type 32', '2023 Volkswagen Type 32', '2024 Volkswagen Type 32',
  '2020 Volkswagen Type 33', '2021 Volkswagen Type 33', '2022 Volkswagen Type 33', '2023 Volkswagen Type 33', '2024 Volkswagen Type 33',
  '2020 Volkswagen Type 34', '2021 Volkswagen Type 34', '2022 Volkswagen Type 34', '2023 Volkswagen Type 34', '2024 Volkswagen Type 34',
  '2020 Volkswagen Type 35', '2021 Volkswagen Type 35', '2022 Volkswagen Type 35', '2023 Volkswagen Type 35', '2024 Volkswagen Type 35',
  '2020 Volkswagen Type 36', '2021 Volkswagen Type 36', '2022 Volkswagen Type 36', '2023 Volkswagen Type 36', '2024 Volkswagen Type 36',
  '2020 Volkswagen Type 37', '2021 Volkswagen Type 37', '2022 Volkswagen Type 37', '2023 Volkswagen Type 37', '2024 Volkswagen Type 37',
  '2020 Volkswagen Type 38', '2021 Volkswagen Type 38', '2022 Volkswagen Type 38', '2023 Volkswagen Type 38', '2024 Volkswagen Type 38',
  '2020 Volkswagen Type 39', '2021 Volkswagen Type 39', '2022 Volkswagen Type 39', '2023 Volkswagen Type 39', '2024 Volkswagen Type 39',
  '2020 Volkswagen Type 40', '2021 Volkswagen Type 40', '2022 Volkswagen Type 40', '2023 Volkswagen Type 40', '2024 Volkswagen Type 40',
  '2020 Volkswagen Type 41', '2021 Volkswagen Type 41', '2022 Volkswagen Type 41', '2023 Volkswagen Type 41', '2024 Volkswagen Type 41',
  '2020 Volkswagen Type 42', '2021 Volkswagen Type 42', '2022 Volkswagen Type 42', '2023 Volkswagen Type 42', '2024 Volkswagen Type 42',
  '2020 Volkswagen Type 43', '2021 Volkswagen Type 43', '2022 Volkswagen Type 43', '2023 Volkswagen Type 43', '2024 Volkswagen Type 43',
  '2020 Volkswagen Type 44', '2021 Volkswagen Type 44', '2022 Volkswagen Type 44', '2023 Volkswagen Type 44', '2024 Volkswagen Type 44',
  '2020 Volkswagen Type 45', '2021 Volkswagen Type 45', '2022 Volkswagen Type 45', '2023 Volkswagen Type 45', '2024 Volkswagen Type 45',
  '2020 Volkswagen Type 46', '2021 Volkswagen Type 46', '2022 Volkswagen Type 46', '2023 Volkswagen Type 46', '2024 Volkswagen Type 46',
  '2020 Volkswagen Type 47', '2021 Volkswagen Type 47', '2022 Volkswagen Type 47', '2023 Volkswagen Type 47', '2024 Volkswagen Type 47',
  '2020 Volkswagen Type 48', '2021 Volkswagen Type 48', '2022 Volkswagen Type 48', '2023 Volkswagen Type 48', '2024 Volkswagen Type 48',
  '2020 Volkswagen Type 49', '2021 Volkswagen Type 49', '2022 Volkswagen Type 49', '2023 Volkswagen Type 49', '2024 Volkswagen Type 49',
  '2020 Volkswagen Type 50', '2021 Volkswagen Type 50', '2022 Volkswagen Type 50', '2023 Volkswagen Type 50', '2024 Volkswagen Type 50',
  '2020 Volkswagen Type 51', '2021 Volkswagen Type 51', '2022 Volkswagen Type 51', '2023 Volkswagen Type 51', '2024 Volkswagen Type 51',
  '2020 Volkswagen Type 52', '2021 Volkswagen Type 52', '2022 Volkswagen Type 52', '2023 Volkswagen Type 52', '2024 Volkswagen Type 52',
  '2020 Volkswagen Type 53', '2021 Volkswagen Type 53', '2022 Volkswagen Type 53', '2023 Volkswagen Type 53', '2024 Volkswagen Type 53',
  '2020 Volkswagen Type 54', '2021 Volkswagen Type 54', '2022 Volkswagen Type 54', '2023 Volkswagen Type 54', '2024 Volkswagen Type 54',
  '2020 Volkswagen Type 55', '2021 Volkswagen Type 55', '2022 Volkswagen Type 55', '2023 Volkswagen Type 55', '2024 Volkswagen Type 55',
  '2020 Volkswagen Type 56', '2021 Volkswagen Type 56', '2022 Volkswagen Type 56', '2023 Volkswagen Type 56', '2024 Volkswagen Type 56',
  '2020 Volkswagen Type 57', '2021 Volkswagen Type 57', '2022 Volkswagen Type 57', '2023 Volkswagen Type 57', '2024 Volkswagen Type 57',
  '2020 Volkswagen Type 58', '2021 Volkswagen Type 58', '2022 Volkswagen Type 58', '2023 Volkswagen Type 58', '2024 Volkswagen Type 58',
  '2020 Volkswagen Type 59', '2021 Volkswagen Type 59', '2022 Volkswagen Type 59', '2023 Volkswagen Type 59', '2024 Volkswagen Type 59',
  '2020 Volkswagen Type 60', '2021 Volkswagen Type 60', '2022 Volkswagen Type 60', '2023 Volkswagen Type 60', '2024 Volkswagen Type 60',
  '2020 Volkswagen Type 61', '2021 Volkswagen Type 61', '2022 Volkswagen Type 61', '2023 Volkswagen Type 61', '2024 Volkswagen Type 61',
  '2020 Volkswagen Type 62', '2021 Volkswagen Type 62', '2022 Volkswagen Type 62', '2023 Volkswagen Type 62', '2024 Volkswagen Type 62',
  '2020 Volkswagen Type 63', '2021 Volkswagen Type 63', '2022 Volkswagen Type 63', '2023 Volkswagen Type 63', '2024 Volkswagen Type 63',
  '2020 Volkswagen Type 64', '2021 Volkswagen Type 64', '2022 Volkswagen Type 64', '2023 Volkswagen Type 64', '2024 Volkswagen Type 64',
  '2020 Volkswagen Type 65', '2021 Volkswagen Type 65', '2022 Volkswagen Type 65', '2023 Volkswagen Type 65', '2024 Volkswagen Type 65',
  '2020 Volkswagen Type 66', '2021 Volkswagen Type 66', '2022 Volkswagen Type 66', '2023 Volkswagen Type 66', '2024 Volkswagen Type 66',
  '2020 Volkswagen Type 67', '2021 Volkswagen Type 67', '2022 Volkswagen Type 67', '2023 Volkswagen Type 67', '2024 Volkswagen Type 67',
  '2020 Volkswagen Type 68', '2021 Volkswagen Type 68', '2022 Volkswagen Type 68', '2023 Volkswagen Type 68', '2024 Volkswagen Type 68',
  '2020 Volkswagen Type 69', '2021 Volkswagen Type 69', '2022 Volkswagen Type 69', '2023 Volkswagen Type 69', '2024 Volkswagen Type 69',
  '2020 Volkswagen Type 70', '2021 Volkswagen Type 70', '2022 Volkswagen Type 70', '2023 Volkswagen Type 70', '2024 Volkswagen Type 70',
  '2020 Volkswagen Type 71', '2021 Volkswagen Type 71', '2022 Volkswagen Type 71', '2023 Volkswagen Type 71', '2024 Volkswagen Type 71',
  '2020 Volkswagen Type 72', '2021 Volkswagen Type 72', '2022 Volkswagen Type 72', '2023 Volkswagen Type 72', '2024 Volkswagen Type 72',
  '2020 Volkswagen Type 73', '2021 Volkswagen Type 73', '2022 Volkswagen Type 73', '2023 Volkswagen Type 73', '2024 Volkswagen Type 73',
  '2020 Volkswagen Type 74', '2021 Volkswagen Type 74', '2022 Volkswagen Type 74', '2023 Volkswagen Type 74', '2024 Volkswagen Type 74',
  '2020 Volkswagen Type 75', '2021 Volkswagen Type 75', '2022 Volkswagen Type 75', '2023 Volkswagen Type 75', '2024 Volkswagen Type 75',
  '2020 Volkswagen Type 76', '2021 Volkswagen Type 76', '2022 Volkswagen Type 76', '2023 Volkswagen Type 76', '2024 Volkswagen Type 76',
  '2020 Volkswagen Type 77', '2021 Volkswagen Type 77', '2022 Volkswagen Type 77', '2023 Volkswagen Type 77', '2024 Volkswagen Type 77',
  '2020 Volkswagen Type 78', '2021 Volkswagen Type 78', '2022 Volkswagen Type 78', '2023 Volkswagen Type 78', '2024 Volkswagen Type 78',
  '2020 Volkswagen Type 79', '2021 Volkswagen Type 79', '2022 Volkswagen Type 79', '2023 Volkswagen Type 79', '2024 Volkswagen Type 79',
  '2020 Volkswagen Type 80', '2021 Volkswagen Type 80', '2022 Volkswagen Type 80', '2023 Volkswagen Type 80', '2024 Volkswagen Type 80',
  '2020 Volkswagen Type 81', '2021 Volkswagen Type 81', '2022 Volkswagen Type 81', '2023 Volkswagen Type 81', '2024 Volkswagen Type 81',
  '2020 Volkswagen Type 82', '2021 Volkswagen Type 82', '2022 Volkswagen Type 82', '2023 Volkswagen Type 82', '2024 Volkswagen Type 82',
  '2020 Volkswagen Type 83', '2021 Volkswagen Type 83', '2022 Volkswagen Type 83', '2023 Volkswagen Type 83', '2024 Volkswagen Type 83',
  '2020 Volkswagen Type 84', '2021 Volkswagen Type 84', '2022 Volkswagen Type 84', '2023 Volkswagen Type 84', '2024 Volkswagen Type 84',
  '2020 Volkswagen Type 85', '2021 Volkswagen Type 85', '2022 Volkswagen Type 85', '2023 Volkswagen Type 85', '2024 Volkswagen Type 85',
  '2020 Volkswagen Type 86', '2021 Volkswagen Type 86', '2022 Volkswagen Type 86', '2023 Volkswagen Type 86', '2024 Volkswagen Type 86',
  '2020 Volkswagen Type 87', '2021 Volkswagen Type 87', '2022 Volkswagen Type 87', '2023 Volkswagen Type 87', '2024 Volkswagen Type 87',
  '2020 Volkswagen Type 88', '2021 Volkswagen Type 88', '2022 Volkswagen Type 88', '2023 Volkswagen Type 88', '2024 Volkswagen Type 88',
  '2020 Volkswagen Type 89', '2021 Volkswagen Type 89', '2022 Volkswagen Type 89', '2023 Volkswagen Type 89', '2024 Volkswagen Type 89',
  '2020 Volkswagen Type 90', '2021 Volkswagen Type 90', '2022 Volkswagen Type 90', '2023 Volkswagen Type 90', '2024 Volkswagen Type 90',
  '2020 Volkswagen Type 91', '2021 Volkswagen Type 91', '2022 Volkswagen Type 91', '2023 Volkswagen Type 91', '2024 Volkswagen Type 91',
  '2020 Volkswagen Type 92', '2021 Volkswagen Type 92', '2022 Volkswagen Type 92', '2023 Volkswagen Type 92', '2024 Volkswagen Type 92',
  '2020 Volkswagen Type 93', '2021 Volkswagen Type 93', '2022 Volkswagen Type 93', '2023 Volkswagen Type 93', '2024 Volkswagen Type 93',
  '2020 Volkswagen Type 94', '2021 Volkswagen Type 94', '2022 Volkswagen Type 94', '2023 Volkswagen Type 94', '2024 Volkswagen Type 94',
  '2020 Volkswagen Type 95', '2021 Volkswagen Type 95', '2022 Volkswagen Type 95', '2023 Volkswagen Type 95', '2024 Volkswagen Type 95',
  '2020 Volkswagen Type 96', '2021 Volkswagen Type 96', '2022 Volkswagen Type 96', '2023 Volkswagen Type 96', '2024 Volkswagen Type 96',
  '2020 Volkswagen Type 97', '2021 Volkswagen Type 97', '2022 Volkswagen Type 97', '2023 Volkswagen Type 97', '2024 Volkswagen Type 97',
  '2020 Volkswagen Type 98', '2021 Volkswagen Type 98', '2022 Volkswagen Type 98', '2023 Volkswagen Type 98', '2024 Volkswagen Type 98',
  '2020 Volkswagen Type 99', '2021 Volkswagen Type 99', '2022 Volkswagen Type 99', '2023 Volkswagen Type 99', '2024 Volkswagen Type 99',
  '2020 Volkswagen Type 100', '2021 Volkswagen Type 100', '2022 Volkswagen Type 100', '2023 Volkswagen Type 100', '2024 Volkswagen Type 100'
];

export interface VehicleSearchProps {
  onVehicleSelect: (vehicle: { name: string; ownership: 'own' | 'want' }) => void;
  placeholder?: string;
  className?: string;
}

export const VehicleSearch: React.FC<VehicleSearchProps> = ({
  onVehicleSelect,
  placeholder = "Start typing to search...",
  className = ""
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCars, setFilteredCars] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter cars based on search query
  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = carDatabase.filter(car =>
        car.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6); // Limit to 6 results
      setFilteredCars(filtered);
      setShowDropdown(true);
    } else {
      setFilteredCars([]);
      setShowDropdown(false);
    }
    setHighlightedIndex(-1);
  }, [searchQuery]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleCarSelect = (car: string) => {
    onVehicleSelect({ name: car, ownership: 'own' });
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredCars.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredCars[highlightedIndex]) {
          handleCarSelect(filteredCars[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  return (
    <div className={`vehicle-search ${className}`} ref={searchRef}>
      <div className="vehicle-search__input-container">
        <Icon name="search" size={20} className="vehicle-search__search-icon" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchQuery.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          className="vehicle-search__input"
        />
      </div>

      {/* Autocomplete Dropdown */}
      {showDropdown && filteredCars.length > 0 && (
        <div className="vehicle-search__dropdown">
          {filteredCars.map((car, index) => (
            <div
              key={car}
              className={`vehicle-search__dropdown-item ${
                index === highlightedIndex ? 'vehicle-search__dropdown-item--highlighted' : ''
              }`}
              onClick={() => handleCarSelect(car)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {car}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleSearch;

