import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image,
  StyleSheet, StatusBar, SafeAreaView, ScrollView,
} from 'react-native';

// ─── DADOS DAS BANDEIRAS ──────────────────────────────────
const BANDEIRA_URL = (sigla) => {
  const mapa = {
    MEX: 'mx', RSA: 'za', KOR: 'kr', CZE: 'cz',
    CAN: 'ca', BIH: 'ba', USA: 'us', PAR: 'py',
    HAI: 'ht', SCO: 'gb-sct', BRA: 'br', MAR: 'ma',
    AUS: 'au', TUR: 'tr', QAT: 'qa', SUI: 'ch',
    CIV: 'ci', ECU: 'ec', GER: 'de', CUW: 'cw',
    NED: 'nl', JPN: 'jp', SWE: 'se', TUN: 'tn',
    KSA: 'sa', URU: 'uy', ESP: 'es', CPV: 'cv',
    IRN: 'ir', NZL: 'nz', BEL: 'be', EGY: 'eg',
    FRA: 'fr', SEN: 'sn', IRQ: 'iq', NOR: 'no',
    ARG: 'ar', ALG: 'dz', AUT: 'at', JOR: 'jo',
    GHA: 'gh', PAN: 'pa', ENG: 'gb-eng', CRO: 'hr',
    POR: 'pt', COD: 'cd', UZB: 'uz', COL: 'co',
  };
  const codigo = mapa[sigla];
  if (!codigo) return null;
  return `https://flagcdn.com/w80/${codigo}.png`;
};

// ─── DADOS DOS JOGOS ──────────────────────────────────────
const JOGOS = [
  { id: 1, fase: "Fase de grupos", grupo: "A", data_brasilia: "2026-06-11", hora_brasilia: "16:00", time_casa: "México", sigla_casa: "MEX", time_fora: "África do Sul", sigla_fora: "RSA", estadio: "Estádio Azteca", cidade: "Cidade do México", pais: "México" },
  { id: 2, fase: "Fase de grupos", grupo: "A", data_brasilia: "2026-06-11", hora_brasilia: "23:00", time_casa: "Coreia do Sul", sigla_casa: "KOR", time_fora: "Tchéquia", sigla_fora: "CZE", estadio: "Estádio Akron", cidade: "Guadalajara", pais: "México" },
  { id: 3, fase: "Fase de grupos", grupo: "B", data_brasilia: "2026-06-12", hora_brasilia: "16:00", time_casa: "Canadá", sigla_casa: "CAN", time_fora: "Bósnia e Herzegovina", sigla_fora: "BIH", estadio: "BMO Field", cidade: "Toronto", pais: "Canadá" },
  { id: 4, fase: "Fase de grupos", grupo: "D", data_brasilia: "2026-06-12", hora_brasilia: "22:00", time_casa: "Estados Unidos", sigla_casa: "USA", time_fora: "Paraguai", sigla_fora: "PAR", estadio: "SoFi Stadium", cidade: "Los Angeles", pais: "Estados Unidos" },
  { id: 5, fase: "Fase de grupos", grupo: "C", data_brasilia: "2026-06-13", hora_brasilia: "22:00", time_casa: "Haiti", sigla_casa: "HAI", time_fora: "Escócia", sigla_fora: "SCO", estadio: "Gillette Stadium", cidade: "Boston/Foxborough", pais: "Estados Unidos" },
  { id: 6, fase: "Fase de grupos", grupo: "D", data_brasilia: "2026-06-13", hora_brasilia: "01:00", time_casa: "Austrália", sigla_casa: "AUS", time_fora: "Turquia", sigla_fora: "TUR", estadio: "BC Place", cidade: "Vancouver", pais: "Canadá" },
  { id: 7, fase: "Fase de grupos", grupo: "C", data_brasilia: "2026-06-13", hora_brasilia: "19:00", time_casa: "Brasil", sigla_casa: "BRA", time_fora: "Marrocos", sigla_fora: "MAR", estadio: "MetLife Stadium", cidade: "Nova York/Nova Jersey", pais: "Estados Unidos" },
  { id: 8, fase: "Fase de grupos", grupo: "B", data_brasilia: "2026-06-13", hora_brasilia: "16:00", time_casa: "Catar", sigla_casa: "QAT", time_fora: "Suíça", sigla_fora: "SUI", estadio: "Levi's Stadium", cidade: "San Francisco/Santa Clara", pais: "Estados Unidos" },
  { id: 9, fase: "Fase de grupos", grupo: "E", data_brasilia: "2026-06-14", hora_brasilia: "20:00", time_casa: "Costa do Marfim", sigla_casa: "CIV", time_fora: "Equador", sigla_fora: "ECU", estadio: "Lincoln Financial Field", cidade: "Filadélfia", pais: "Estados Unidos" },
  { id: 10, fase: "Fase de grupos", grupo: "E", data_brasilia: "2026-06-14", hora_brasilia: "14:00", time_casa: "Alemanha", sigla_casa: "GER", time_fora: "Curaçao", sigla_fora: "CUW", estadio: "NRG Stadium", cidade: "Houston", pais: "Estados Unidos" },
  { id: 11, fase: "Fase de grupos", grupo: "F", data_brasilia: "2026-06-14", hora_brasilia: "17:00", time_casa: "Holanda", sigla_casa: "NED", time_fora: "Japão", sigla_fora: "JPN", estadio: "AT&T Stadium", cidade: "Dallas", pais: "Estados Unidos" },
  { id: 12, fase: "Fase de grupos", grupo: "F", data_brasilia: "2026-06-14", hora_brasilia: "23:00", time_casa: "Suécia", sigla_casa: "SWE", time_fora: "Tunísia", sigla_fora: "TUN", estadio: "Estádio BBVA", cidade: "Monterrey", pais: "México" },
  { id: 13, fase: "Fase de grupos", grupo: "H", data_brasilia: "2026-06-15", hora_brasilia: "19:00", time_casa: "Arábia Saudita", sigla_casa: "KSA", time_fora: "Uruguai", sigla_fora: "URU", estadio: "Hard Rock Stadium", cidade: "Miami", pais: "Estados Unidos" },
  { id: 14, fase: "Fase de grupos", grupo: "H", data_brasilia: "2026-06-15", hora_brasilia: "13:00", time_casa: "Espanha", sigla_casa: "ESP", time_fora: "Cabo Verde", sigla_fora: "CPV", estadio: "Mercedes-Benz Stadium", cidade: "Atlanta", pais: "Estados Unidos" },
  { id: 15, fase: "Fase de grupos", grupo: "G", data_brasilia: "2026-06-15", hora_brasilia: "22:00", time_casa: "Irã", sigla_casa: "IRN", time_fora: "Nova Zelândia", sigla_fora: "NZL", estadio: "SoFi Stadium", cidade: "Los Angeles", pais: "Estados Unidos" },
  { id: 16, fase: "Fase de grupos", grupo: "G", data_brasilia: "2026-06-16", hora_brasilia: "16:00", time_casa: "Bélgica", sigla_casa: "BEL", time_fora: "Egito", sigla_fora: "EGY", estadio: "Lumen Field", cidade: "Seattle", pais: "Estados Unidos" },
  { id: 17, fase: "Fase de grupos", grupo: "I", data_brasilia: "2026-06-16", hora_brasilia: "16:00", time_casa: "França", sigla_casa: "FRA", time_fora: "Senegal", sigla_fora: "SEN", estadio: "MetLife Stadium", cidade: "Nova York/Nova Jersey", pais: "Estados Unidos" },
  { id: 18, fase: "Fase de grupos", grupo: "I", data_brasilia: "2026-06-16", hora_brasilia: "19:00", time_casa: "Iraque", sigla_casa: "IRQ", time_fora: "Noruega", sigla_fora: "NOR", estadio: "GEHA Field at Arrowhead Stadium", cidade: "Kansas City", pais: "Estados Unidos" },
  { id: 19, fase: "Fase de grupos", grupo: "J", data_brasilia: "2026-06-16", hora_brasilia: "22:00", time_casa: "Argentina", sigla_casa: "ARG", time_fora: "Argélia", sigla_fora: "ALG", estadio: "AT&T Stadium", cidade: "Dallas", pais: "Estados Unidos" },
  { id: 20, fase: "Fase de grupos", grupo: "J", data_brasilia: "2026-06-17", hora_brasilia: "01:00", time_casa: "Áustria", sigla_casa: "AUT", time_fora: "Jordânia", sigla_fora: "JOR", estadio: "Levi's Stadium", cidade: "San Francisco/Santa Clara", pais: "Estados Unidos" },
  { id: 21, fase: "Fase de grupos", grupo: "L", data_brasilia: "2026-06-17", hora_brasilia: "20:00", time_casa: "Gana", sigla_casa: "GHA", time_fora: "Panamá", sigla_fora: "PAN", estadio: "BMO Field", cidade: "Toronto", pais: "Canadá" },
  { id: 22, fase: "Fase de grupos", grupo: "L", data_brasilia: "2026-06-17", hora_brasilia: "17:00", time_casa: "Inglaterra", sigla_casa: "ENG", time_fora: "Croácia", sigla_fora: "CRO", estadio: "Gillette Stadium", cidade: "Boston/Foxborough", pais: "Estados Unidos" },
  { id: 23, fase: "Fase de grupos", grupo: "K", data_brasilia: "2026-06-18", hora_brasilia: "14:00", time_casa: "Portugal", sigla_casa: "POR", time_fora: "RD Congo", sigla_fora: "COD", estadio: "NRG Stadium", cidade: "Houston", pais: "Estados Unidos" },
  { id: 24, fase: "Fase de grupos", grupo: "K", data_brasilia: "2026-06-18", hora_brasilia: "23:00", time_casa: "Uzbequistão", sigla_casa: "UZB", time_fora: "Colômbia", sigla_fora: "COL", estadio: "Estádio Akron", cidade: "Guadalajara", pais: "México" },
  { id: 25, fase: "Fase de grupos", grupo: "A", data_brasilia: "2026-06-18", hora_brasilia: "13:00", time_casa: "Tchéquia", sigla_casa: "CZE", time_fora: "África do Sul", sigla_fora: "RSA", estadio: "Mercedes-Benz Stadium", cidade: "Atlanta", pais: "Estados Unidos" },
  { id: 26, fase: "Fase de grupos", grupo: "B", data_brasilia: "2026-06-18", hora_brasilia: "16:00", time_casa: "Suíça", sigla_casa: "SUI", time_fora: "Bósnia e Herzegovina", sigla_fora: "BIH", estadio: "SoFi Stadium", cidade: "Los Angeles", pais: "Estados Unidos" },
  { id: 27, fase: "Fase de grupos", grupo: "B", data_brasilia: "2026-06-18", hora_brasilia: "19:00", time_casa: "Canadá", sigla_casa: "CAN", time_fora: "Catar", sigla_fora: "QAT", estadio: "BC Place", cidade: "Vancouver", pais: "Canadá" },
  { id: 28, fase: "Fase de grupos", grupo: "A", data_brasilia: "2026-06-18", hora_brasilia: "22:00", time_casa: "México", sigla_casa: "MEX", time_fora: "Coreia do Sul", sigla_fora: "KOR", estadio: "Estádio Akron", cidade: "Guadalajara", pais: "México" },
  { id: 29, fase: "Fase de grupos", grupo: "C", data_brasilia: "2026-06-19", hora_brasilia: "21:30", time_casa: "Brasil", sigla_casa: "BRA", time_fora: "Haiti", sigla_fora: "HAI", estadio: "Lincoln Financial Field", cidade: "Filadélfia", pais: "Estados Unidos" },
  { id: 30, fase: "Fase de grupos", grupo: "C", data_brasilia: "2026-06-19", hora_brasilia: "19:00", time_casa: "Escócia", sigla_casa: "SCO", time_fora: "Marrocos", sigla_fora: "MAR", estadio: "Gillette Stadium", cidade: "Boston/Foxborough", pais: "Estados Unidos" },
  { id: 31, fase: "Fase de grupos", grupo: "D", data_brasilia: "2026-06-20", hora_brasilia: "00:00", time_casa: "Turquia", sigla_casa: "TUR", time_fora: "Paraguai", sigla_fora: "PAR", estadio: "Levi's Stadium", cidade: "San Francisco/Santa Clara", pais: "Estados Unidos" },
  { id: 32, fase: "Fase de grupos", grupo: "D", data_brasilia: "2026-06-19", hora_brasilia: "16:00", time_casa: "Estados Unidos", sigla_casa: "USA", time_fora: "Austrália", sigla_fora: "AUS", estadio: "Lumen Field", cidade: "Seattle", pais: "Estados Unidos" },
  { id: 33, fase: "Fase de grupos", grupo: "E", data_brasilia: "2026-06-20", hora_brasilia: "17:00", time_casa: "Alemanha", sigla_casa: "GER", time_fora: "Costa do Marfim", sigla_fora: "CIV", estadio: "BMO Field", cidade: "Toronto", pais: "Canadá" },
  { id: 34, fase: "Fase de grupos", grupo: "E", data_brasilia: "2026-06-20", hora_brasilia: "21:00", time_casa: "Equador", sigla_casa: "ECU", time_fora: "Curaçao", sigla_fora: "CUW", estadio: "GEHA Field at Arrowhead Stadium", cidade: "Kansas City", pais: "Estados Unidos" },
  { id: 35, fase: "Fase de grupos", grupo: "F", data_brasilia: "2026-06-20", hora_brasilia: "14:00", time_casa: "Holanda", sigla_casa: "NED", time_fora: "Suécia", sigla_fora: "SWE", estadio: "NRG Stadium", cidade: "Houston", pais: "Estados Unidos" },
  { id: 36, fase: "Fase de grupos", grupo: "F", data_brasilia: "2026-06-20", hora_brasilia: "01:00", time_casa: "Tunísia", sigla_casa: "TUN", time_fora: "Japão", sigla_fora: "JPN", estadio: "Estádio BBVA", cidade: "Monterrey", pais: "México" },
  { id: 37, fase: "Fase de grupos", grupo: "H", data_brasilia: "2026-06-21", hora_brasilia: "19:00", time_casa: "Uruguai", sigla_casa: "URU", time_fora: "Cabo Verde", sigla_fora: "CPV", estadio: "Hard Rock Stadium", cidade: "Miami", pais: "Estados Unidos" },
  { id: 38, fase: "Fase de grupos", grupo: "H", data_brasilia: "2026-06-21", hora_brasilia: "13:00", time_casa: "Espanha", sigla_casa: "ESP", time_fora: "Arábia Saudita", sigla_fora: "KSA", estadio: "Mercedes-Benz Stadium", cidade: "Atlanta", pais: "Estados Unidos" },
  { id: 39, fase: "Fase de grupos", grupo: "G", data_brasilia: "2026-06-21", hora_brasilia: "16:00", time_casa: "Bélgica", sigla_casa: "BEL", time_fora: "Irã", sigla_fora: "IRN", estadio: "SoFi Stadium", cidade: "Los Angeles", pais: "Estados Unidos" },
  { id: 40, fase: "Fase de grupos", grupo: "G", data_brasilia: "2026-06-21", hora_brasilia: "22:00", time_casa: "Nova Zelândia", sigla_casa: "NZL", time_fora: "Egito", sigla_fora: "EGY", estadio: "BC Place", cidade: "Vancouver", pais: "Canadá" },
  { id: 41, fase: "Fase de grupos", grupo: "I", data_brasilia: "2026-06-22", hora_brasilia: "21:00", time_casa: "Noruega", sigla_casa: "NOR", time_fora: "Senegal", sigla_fora: "SEN", estadio: "BMO Field", cidade: "Toronto", pais: "Canadá" },
  { id: 42, fase: "Fase de grupos", grupo: "I", data_brasilia: "2026-06-22", hora_brasilia: "18:00", time_casa: "França", sigla_casa: "FRA", time_fora: "Iraque", sigla_fora: "IRQ", estadio: "Lincoln Financial Field", cidade: "Filadélfia", pais: "Estados Unidos" },
  { id: 43, fase: "Fase de grupos", grupo: "J", data_brasilia: "2026-06-22", hora_brasilia: "14:00", time_casa: "Argentina", sigla_casa: "ARG", time_fora: "Áustria", sigla_fora: "AUT", estadio: "AT&T Stadium", cidade: "Dallas", pais: "Estados Unidos" },
  { id: 44, fase: "Fase de grupos", grupo: "J", data_brasilia: "2026-06-23", hora_brasilia: "00:00", time_casa: "Jordânia", sigla_casa: "JOR", time_fora: "Argélia", sigla_fora: "ALG", estadio: "Levi's Stadium", cidade: "San Francisco/Santa Clara", pais: "Estados Unidos" },
  { id: 45, fase: "Fase de grupos", grupo: "L", data_brasilia: "2026-06-23", hora_brasilia: "17:00", time_casa: "Inglaterra", sigla_casa: "ENG", time_fora: "Gana", sigla_fora: "GHA", estadio: "Gillette Stadium", cidade: "Boston/Foxborough", pais: "Estados Unidos" },
  { id: 46, fase: "Fase de grupos", grupo: "L", data_brasilia: "2026-06-23", hora_brasilia: "20:00", time_casa: "Panamá", sigla_casa: "PAN", time_fora: "Croácia", sigla_fora: "CRO", estadio: "BMO Field", cidade: "Toronto", pais: "Canadá" },
  { id: 47, fase: "Fase de grupos", grupo: "K", data_brasilia: "2026-06-23", hora_brasilia: "14:00", time_casa: "Portugal", sigla_casa: "POR", time_fora: "Uzbequistão", sigla_fora: "UZB", estadio: "NRG Stadium", cidade: "Houston", pais: "Estados Unidos" },
  { id: 48, fase: "Fase de grupos", grupo: "K", data_brasilia: "2026-06-23", hora_brasilia: "23:00", time_casa: "Colômbia", sigla_casa: "COL", time_fora: "RD Congo", sigla_fora: "COD", estadio: "Estádio Akron", cidade: "Guadalajara", pais: "México" },
  { id: 49, fase: "Fase de grupos", grupo: "C", data_brasilia: "2026-06-24", hora_brasilia: "19:00", time_casa: "Escócia", sigla_casa: "SCO", time_fora: "Brasil", sigla_fora: "BRA", estadio: "Hard Rock Stadium", cidade: "Miami", pais: "Estados Unidos" },
  { id: 50, fase: "Fase de grupos", grupo: "C", data_brasilia: "2026-06-24", hora_brasilia: "19:00", time_casa: "Marrocos", sigla_casa: "MAR", time_fora: "Haiti", sigla_fora: "HAI", estadio: "Mercedes-Benz Stadium", cidade: "Atlanta", pais: "Estados Unidos" },
  { id: 51, fase: "Fase de grupos", grupo: "B", data_brasilia: "2026-06-24", hora_brasilia: "16:00", time_casa: "Suíça", sigla_casa: "SUI", time_fora: "Canadá", sigla_fora: "CAN", estadio: "BC Place", cidade: "Vancouver", pais: "Canadá" },
  { id: 52, fase: "Fase de grupos", grupo: "B", data_brasilia: "2026-06-24", hora_brasilia: "16:00", time_casa: "Bósnia e Herzegovina", sigla_casa: "BIH", time_fora: "Catar", sigla_fora: "QAT", estadio: "Lumen Field", cidade: "Seattle", pais: "Estados Unidos" },
  { id: 53, fase: "Fase de grupos", grupo: "A", data_brasilia: "2026-06-24", hora_brasilia: "22:00", time_casa: "Tchéquia", sigla_casa: "CZE", time_fora: "México", sigla_fora: "MEX", estadio: "Estádio Azteca", cidade: "Cidade do México", pais: "México" },
  { id: 54, fase: "Fase de grupos", grupo: "A", data_brasilia: "2026-06-24", hora_brasilia: "22:00", time_casa: "África do Sul", sigla_casa: "RSA", time_fora: "Coreia do Sul", sigla_fora: "KOR", estadio: "Estádio BBVA", cidade: "Monterrey", pais: "México" },
  { id: 55, fase: "Fase de grupos", grupo: "E", data_brasilia: "2026-06-25", hora_brasilia: "17:00", time_casa: "Curaçao", sigla_casa: "CUW", time_fora: "Costa do Marfim", sigla_fora: "CIV", estadio: "Lincoln Financial Field", cidade: "Filadélfia", pais: "Estados Unidos" },
  { id: 56, fase: "Fase de grupos", grupo: "E", data_brasilia: "2026-06-25", hora_brasilia: "17:00", time_casa: "Equador", sigla_casa: "ECU", time_fora: "Alemanha", sigla_fora: "GER", estadio: "MetLife Stadium", cidade: "Nova York/Nova Jersey", pais: "Estados Unidos" },
  { id: 57, fase: "Fase de grupos", grupo: "F", data_brasilia: "2026-06-25", hora_brasilia: "20:00", time_casa: "Japão", sigla_casa: "JPN", time_fora: "Suécia", sigla_fora: "SWE", estadio: "AT&T Stadium", cidade: "Dallas", pais: "Estados Unidos" },
  { id: 58, fase: "Fase de grupos", grupo: "F", data_brasilia: "2026-06-25", hora_brasilia: "20:00", time_casa: "Tunísia", sigla_casa: "TUN", time_fora: "Holanda", sigla_fora: "NED", estadio: "GEHA Field at Arrowhead Stadium", cidade: "Kansas City", pais: "Estados Unidos" },
  { id: 59, fase: "Fase de grupos", grupo: "D", data_brasilia: "2026-06-25", hora_brasilia: "23:00", time_casa: "Turquia", sigla_casa: "TUR", time_fora: "Estados Unidos", sigla_fora: "USA", estadio: "SoFi Stadium", cidade: "Los Angeles", pais: "Estados Unidos" },
  { id: 60, fase: "Fase de grupos", grupo: "D", data_brasilia: "2026-06-25", hora_brasilia: "23:00", time_casa: "Paraguai", sigla_casa: "PAR", time_fora: "Austrália", sigla_fora: "AUS", estadio: "Levi's Stadium", cidade: "San Francisco/Santa Clara", pais: "Estados Unidos" },
  { id: 61, fase: "Fase de grupos", grupo: "I", data_brasilia: "2026-06-26", hora_brasilia: "16:00", time_casa: "Noruega", sigla_casa: "NOR", time_fora: "França", sigla_fora: "FRA", estadio: "Gillette Stadium", cidade: "Boston/Foxborough", pais: "Estados Unidos" },
  { id: 62, fase: "Fase de grupos", grupo: "I", data_brasilia: "2026-06-26", hora_brasilia: "16:00", time_casa: "Senegal", sigla_casa: "SEN", time_fora: "Iraque", sigla_fora: "IRQ", estadio: "BMO Field", cidade: "Toronto", pais: "Canadá" },
  { id: 63, fase: "Fase de grupos", grupo: "G", data_brasilia: "2026-06-27", hora_brasilia: "00:00", time_casa: "Egito", sigla_casa: "EGY", time_fora: "Irã", sigla_fora: "IRN", estadio: "Lumen Field", cidade: "Seattle", pais: "Estados Unidos" },
  { id: 64, fase: "Fase de grupos", grupo: "G", data_brasilia: "2026-06-27", hora_brasilia: "00:00", time_casa: "Nova Zelândia", sigla_casa: "NZL", time_fora: "Bélgica", sigla_fora: "BEL", estadio: "BC Place", cidade: "Vancouver", pais: "Canadá" },
  { id: 65, fase: "Fase de grupos", grupo: "H", data_brasilia: "2026-06-26", hora_brasilia: "21:00", time_casa: "Cabo Verde", sigla_casa: "CPV", time_fora: "Arábia Saudita", sigla_fora: "KSA", estadio: "NRG Stadium", cidade: "Houston", pais: "Estados Unidos" },
  { id: 66, fase: "Fase de grupos", grupo: "H", data_brasilia: "2026-06-26", hora_brasilia: "21:00", time_casa: "Uruguai", sigla_casa: "URU", time_fora: "Espanha", sigla_fora: "ESP", estadio: "Estádio Akron", cidade: "Guadalajara", pais: "México" },
  { id: 67, fase: "Fase de grupos", grupo: "L", data_brasilia: "2026-06-27", hora_brasilia: "18:00", time_casa: "Panamá", sigla_casa: "PAN", time_fora: "Inglaterra", sigla_fora: "ENG", estadio: "MetLife Stadium", cidade: "Nova York/Nova Jersey", pais: "Estados Unidos" },
  { id: 68, fase: "Fase de grupos", grupo: "L", data_brasilia: "2026-06-27", hora_brasilia: "18:00", time_casa: "Croácia", sigla_casa: "CRO", time_fora: "Gana", sigla_fora: "GHA", estadio: "Lincoln Financial Field", cidade: "Filadélfia", pais: "Estados Unidos" },
  { id: 69, fase: "Fase de grupos", grupo: "J", data_brasilia: "2026-06-27", hora_brasilia: "23:00", time_casa: "Argélia", sigla_casa: "ALG", time_fora: "Áustria", sigla_fora: "AUT", estadio: "AT&T Stadium", cidade: "Dallas", pais: "Estados Unidos" },
  { id: 70, fase: "Fase de grupos", grupo: "J", data_brasilia: "2026-06-27", hora_brasilia: "23:00", time_casa: "Jordânia", sigla_casa: "JOR", time_fora: "Argentina", sigla_fora: "ARG", estadio: "Levi's Stadium", cidade: "San Francisco/Santa Clara", pais: "Estados Unidos" },
  { id: 71, fase: "Fase de grupos", grupo: "K", data_brasilia: "2026-06-27", hora_brasilia: "20:30", time_casa: "Colômbia", sigla_casa: "COL", time_fora: "Portugal", sigla_fora: "POR", estadio: "Hard Rock Stadium", cidade: "Miami", pais: "Estados Unidos" },
  { id: 72, fase: "Fase de grupos", grupo: "K", data_brasilia: "2026-06-27", hora_brasilia: "20:30", time_casa: "RD Congo", sigla_casa: "COD", time_fora: "Uzbequistão", sigla_fora: "UZB", estadio: "Estádio BBVA", cidade: "Monterrey", pais: "México" },
  { id: 73, fase: "16-avos de final", grupo: null, data_brasilia: "2026-06-28", hora_brasilia: "16:00", time_casa: "2º Grupo A", sigla_casa: "2A", time_fora: "2º Grupo B", sigla_fora: "2B", estadio: "SoFi Stadium", cidade: "Los Angeles", pais: "Estados Unidos" },
  { id: 74, fase: "16-avos de final", grupo: null, data_brasilia: "2026-06-28", hora_brasilia: "17:30", time_casa: "1º Grupo E", sigla_casa: "1E", time_fora: "3º ABCDF", sigla_fora: "3ABC", estadio: "Gillette Stadium", cidade: "Boston/Foxborough", pais: "Estados Unidos" },
  { id: 75, fase: "16-avos de final", grupo: null, data_brasilia: "2026-06-28", hora_brasilia: "22:00", time_casa: "1º Grupo F", sigla_casa: "1F", time_fora: "2º Grupo C", sigla_fora: "2C", estadio: "Estádio BBVA", cidade: "Monterrey", pais: "México" },
  { id: 76, fase: "16-avos de final", grupo: null, data_brasilia: "2026-06-29", hora_brasilia: "14:00", time_casa: "1º Grupo C", sigla_casa: "1C", time_fora: "2º Grupo F", sigla_fora: "2F", estadio: "NRG Stadium", cidade: "Houston", pais: "Estados Unidos" },
  { id: 77, fase: "16-avos de final", grupo: null, data_brasilia: "2026-06-29", hora_brasilia: "18:00", time_casa: "1º Grupo I", sigla_casa: "1I", time_fora: "3º CDFGH", sigla_fora: "3CDF", estadio: "MetLife Stadium", cidade: "Nova York/Nova Jersey", pais: "Estados Unidos" },
  { id: 78, fase: "16-avos de final", grupo: null, data_brasilia: "2026-06-29", hora_brasilia: "14:00", time_casa: "2º Grupo E", sigla_casa: "2E", time_fora: "2º Grupo I", sigla_fora: "2I", estadio: "AT&T Stadium", cidade: "Dallas", pais: "Estados Unidos" },
  { id: 79, fase: "16-avos de final", grupo: null, data_brasilia: "2026-06-30", hora_brasilia: "22:00", time_casa: "1º Grupo A", sigla_casa: "1A", time_fora: "3º CEFHI", sigla_fora: "3CEF", estadio: "Estádio Azteca", cidade: "Cidade do México", pais: "México" },
  { id: 80, fase: "16-avos de final", grupo: null, data_brasilia: "2026-06-30", hora_brasilia: "13:00", time_casa: "1º Grupo L", sigla_casa: "1L", time_fora: "3º EHIJK", sigla_fora: "3EHI", estadio: "Mercedes-Benz Stadium", cidade: "Atlanta", pais: "Estados Unidos" },
  { id: 81, fase: "16-avos de final", grupo: null, data_brasilia: "2026-06-30", hora_brasilia: "21:00", time_casa: "1º Grupo D", sigla_casa: "1D", time_fora: "3º BEFIJ", sigla_fora: "3BEF", estadio: "Levi's Stadium", cidade: "San Francisco/Santa Clara", pais: "Estados Unidos" },
  { id: 82, fase: "16-avos de final", grupo: null, data_brasilia: "2026-07-01", hora_brasilia: "17:00", time_casa: "1º Grupo G", sigla_casa: "1G", time_fora: "3º AEHIJ", sigla_fora: "3AEH", estadio: "Lumen Field", cidade: "Seattle", pais: "Estados Unidos" },
  { id: 83, fase: "16-avos de final", grupo: null, data_brasilia: "2026-07-01", hora_brasilia: "20:00", time_casa: "2º Grupo K", sigla_casa: "2K", time_fora: "2º Grupo L", sigla_fora: "2L", estadio: "Hard Rock Stadium", cidade: "Miami", pais: "Estados Unidos" },
  { id: 84, fase: "16-avos de final", grupo: null, data_brasilia: "2026-07-01", hora_brasilia: "16:00", time_casa: "1º Grupo H", sigla_casa: "1H", time_fora: "2º Grupo J", sigla_fora: "2J", estadio: "GEHA Field at Arrowhead Stadium", cidade: "Kansas City", pais: "Estados Unidos" },
  { id: 85, fase: "16-avos de final", grupo: null, data_brasilia: "2026-07-03", hora_brasilia: "00:00", time_casa: "1º Grupo B", sigla_casa: "1B", time_fora: "3º EFGIJ", sigla_fora: "3EFG", estadio: "BC Place", cidade: "Vancouver", pais: "Canadá" },
  { id: 86, fase: "16-avos de final", grupo: null, data_brasilia: "2026-07-02", hora_brasilia: "19:00", time_casa: "1º Grupo J", sigla_casa: "1J", time_fora: "2º Grupo H", sigla_fora: "2H", estadio: "Lincoln Financial Field", cidade: "Filadélfia", pais: "Estados Unidos" },
  { id: 87, fase: "16-avos de final", grupo: null, data_brasilia: "2026-07-02", hora_brasilia: "22:30", time_casa: "1º Grupo K", sigla_casa: "1K", time_fora: "3º DEIJL", sigla_fora: "3DEI", estadio: "MetLife Stadium", cidade: "Nova York/Nova Jersey", pais: "Estados Unidos" },
  { id: 88, fase: "16-avos de final", grupo: null, data_brasilia: "2026-07-03", hora_brasilia: "15:00", time_casa: "2º Grupo D", sigla_casa: "2D", time_fora: "2º Grupo G", sigla_fora: "2G", estadio: "AT&T Stadium", cidade: "Dallas", pais: "Estados Unidos" },
  { id: 89, fase: "Oitavas de final", grupo: null, data_brasilia: "2026-07-04", hora_brasilia: "18:00", time_casa: "W74", sigla_casa: "W74", time_fora: "W77", sigla_fora: "W77", estadio: "Gillette Stadium", cidade: "Boston/Foxborough", pais: "Estados Unidos" },
  { id: 90, fase: "Oitavas de final", grupo: null, data_brasilia: "2026-07-04", hora_brasilia: "14:00", time_casa: "W73", sigla_casa: "W73", time_fora: "W75", sigla_fora: "W75", estadio: "SoFi Stadium", cidade: "Los Angeles", pais: "Estados Unidos" },
  { id: 91, fase: "Oitavas de final", grupo: null, data_brasilia: "2026-07-05", hora_brasilia: "17:00", time_casa: "W76", sigla_casa: "W76", time_fora: "W78", sigla_fora: "W78", estadio: "NRG Stadium", cidade: "Houston", pais: "Estados Unidos" },
  { id: 92, fase: "Oitavas de final", grupo: null, data_brasilia: "2026-07-05", hora_brasilia: "21:00", time_casa: "W79", sigla_casa: "W79", time_fora: "W80", sigla_fora: "W80", estadio: "Estádio Azteca", cidade: "Cidade do México", pais: "México" },
  { id: 93, fase: "Oitavas de final", grupo: null, data_brasilia: "2026-07-06", hora_brasilia: "16:00", time_casa: "W83", sigla_casa: "W83", time_fora: "W84", sigla_fora: "W84", estadio: "AT&T Stadium", cidade: "Dallas", pais: "Estados Unidos" },
  { id: 94, fase: "Oitavas de final", grupo: null, data_brasilia: "2026-07-06", hora_brasilia: "21:00", time_casa: "W81", sigla_casa: "W81", time_fora: "W82", sigla_fora: "W82", estadio: "Lumen Field", cidade: "Seattle", pais: "Estados Unidos" },
  { id: 95, fase: "Oitavas de final", grupo: null, data_brasilia: "2026-07-07", hora_brasilia: "13:00", time_casa: "W86", sigla_casa: "W86", time_fora: "W88", sigla_fora: "W88", estadio: "Mercedes-Benz Stadium", cidade: "Atlanta", pais: "Estados Unidos" },
  { id: 96, fase: "Oitavas de final", grupo: null, data_brasilia: "2026-07-07", hora_brasilia: "17:00", time_casa: "W85", sigla_casa: "W85", time_fora: "W87", sigla_fora: "W87", estadio: "BC Place", cidade: "Vancouver", pais: "Canadá" },
  { id: 97, fase: "Quartas de final", grupo: null, data_brasilia: "2026-07-09", hora_brasilia: "17:00", time_casa: "W89", sigla_casa: "W89", time_fora: "W90", sigla_fora: "W90", estadio: "Gillette Stadium", cidade: "Boston/Foxborough", pais: "Estados Unidos" },
  { id: 98, fase: "Quartas de final", grupo: null, data_brasilia: "2026-07-10", hora_brasilia: "16:00", time_casa: "W93", sigla_casa: "W93", time_fora: "W94", sigla_fora: "W94", estadio: "SoFi Stadium", cidade: "Los Angeles", pais: "Estados Unidos" },
  { id: 99, fase: "Quartas de final", grupo: null, data_brasilia: "2026-07-10", hora_brasilia: "18:00", time_casa: "W91", sigla_casa: "W91", time_fora: "W92", sigla_fora: "W92", estadio: "Hard Rock Stadium", cidade: "Miami", pais: "Estados Unidos" },
  { id: 100, fase: "Quartas de final", grupo: null, data_brasilia: "2026-07-11", hora_brasilia: "22:00", time_casa: "W95", sigla_casa: "W95", time_fora: "W96", sigla_fora: "W96", estadio: "GEHA Field at Arrowhead Stadium", cidade: "Kansas City", pais: "Estados Unidos" },
  { id: 101, fase: "Semifinal", grupo: null, data_brasilia: "2026-07-14", hora_brasilia: "16:00", time_casa: "W97", sigla_casa: "W97", time_fora: "W98", sigla_fora: "W98", estadio: "AT&T Stadium", cidade: "Dallas", pais: "Estados Unidos" },
  { id: 102, fase: "Semifinal", grupo: null, data_brasilia: "2026-07-15", hora_brasilia: "16:00", time_casa: "W99", sigla_casa: "W99", time_fora: "W100", sigla_fora: "W100", estadio: "Mercedes-Benz Stadium", cidade: "Atlanta", pais: "Estados Unidos" },
  { id: 103, fase: "Disputa de 3º lugar", grupo: null, data_brasilia: "2026-07-18", hora_brasilia: "18:00", time_casa: "L101", sigla_casa: "L101", time_fora: "L102", sigla_fora: "L102", estadio: "Hard Rock Stadium", cidade: "Miami", pais: "Estados Unidos" },
  { id: 104, fase: "Final", grupo: null, data_brasilia: "2026-07-19", hora_brasilia: "16:00", time_casa: "W101", sigla_casa: "W101", time_fora: "W102", sigla_fora: "W102", estadio: "MetLife Stadium", cidade: "Nova York/Nova Jersey", pais: "Estados Unidos" },
];

// ─── Cores ────────────────────────────────────────────────
const C = {
  bg: '#07111E',
  card: '#0D1B2A',
  cardBorder: '#1A2E42',
  gold: '#D4A820',
  white: '#FFFFFF',
  gray: '#8899AA',
  grayDark: '#1E2D3D',
};

const FASES = [
  'Fase de grupos',
  '16-avos de final',
  'Oitavas de final',
  'Quartas de final',
  'Semifinal',
  'Disputa de 3º lugar',
  'Final',
];

// ─── Utilitários ──────────────────────────────────────────
function formatarDataCompleta(dataStr) {
  const meses = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  const [, mesIdx, dia] = dataStr.split('-');
  return `${parseInt(dia)} de ${meses[parseInt(mesIdx) - 1]}`;
}

function agruparPorData(jogos) {
  const grupos = {};
  for (const jogo of jogos) {
    if (!grupos[jogo.data_brasilia]) grupos[jogo.data_brasilia] = [];
    grupos[jogo.data_brasilia].push(jogo);
  }
  return Object.entries(grupos).sort(([a], [b]) => a.localeCompare(b));
}

// ─── Componente Bandeira ──────────────────────────────────
function Bandeira({ sigla, size = 36 }) {
  const url = BANDEIRA_URL(sigla);
  if (!url) {
    return (
      <View style={[styles.bandeiraPlaceholder, { width: size * 1.4, height: size * 0.9 }]}>
        <Text style={{ color: C.gray, fontSize: size * 0.28, fontWeight: '700' }}>{sigla}</Text>
      </View>
    );
  }
  return (
    <Image
      source={{ uri: url }}
      style={{ width: size * 1.4, height: size * 0.9, borderRadius: 3 }}
      resizeMode="cover"
    />
  );
}

// ─── Card de Jogo ─────────────────────────────────────────
function CardJogo({ jogo }) {
  const temGrupo = jogo.grupo !== null;
  const isFinal = jogo.fase === 'Final';

  return (
    <View style={[styles.card, isFinal && styles.cardFinal]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardGrupo}>
          {temGrupo ? `GRUPO ${jogo.grupo}` : jogo.fase.toUpperCase()}
        </Text>
        <Text style={styles.cardHora}>{jogo.hora_brasilia}</Text>
      </View>

      <View style={styles.confronto}>
        <View style={styles.time}>
          <Bandeira sigla={jogo.sigla_casa} size={38} />
          <Text style={styles.timeSigla}>{jogo.sigla_casa}</Text>
        </View>
        <View style={styles.vsContainer}>
          <Text style={styles.vsTexto}>VS</Text>
        </View>
        <View style={styles.time}>
          <Bandeira sigla={jogo.sigla_fora} size={38} />
          <Text style={styles.timeSigla}>{jogo.sigla_fora}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.cardEstadio} numberOfLines={1}>{jogo.estadio}</Text>
        <Text style={styles.cardCidade} numberOfLines={1}>{jogo.cidade} • {jogo.pais}</Text>
      </View>
    </View>
  );
}

// ─── App Principal ────────────────────────────────────────
export default function App() {
  const [faseSelecionada, setFaseSelecionada] = useState('Fase de grupos');

  const jogosFiltrados = useMemo(
    () => JOGOS.filter(j => j.fase === faseSelecionada),
    [faseSelecionada]
  );

  const jogosPorData = useMemo(
    () => agruparPorData(jogosFiltrados),
    [jogosFiltrados]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoUni}>UNI</Text>
        <Text style={styles.logoCopa}>Copa</Text>
        <Text style={styles.titulo}>CALENDÁRIO</Text>
      </View>

      {/* Filtro de Fases */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtroScroll}
        contentContainerStyle={styles.filtroContent}
      >
        {FASES.map(fase => (
          <TouchableOpacity
            key={fase}
            style={[styles.faseBotao, faseSelecionada === fase && styles.faseBotaoAtivo]}
            onPress={() => setFaseSelecionada(fase)}
          >
            <Text style={[styles.faseTexto, faseSelecionada === fase && styles.faseTextoAtivo]}>
              {fase}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista */}
      <FlatList
        data={jogosPorData}
        keyExtractor={([data]) => data}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: [data, jogos] }) => (
          <View>
            <View style={styles.dataHeader}>
              <View style={styles.dataLinha} />
              <Text style={styles.dataTexto}>{formatarDataCompleta(data)}</Text>
              <View style={styles.dataLinha} />
            </View>
            {jogos.map(jogo => (
              <CardJogo key={jogo.id} jogo={jogo} />
            ))}
          </View>
        )}
      />
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
    paddingTop: 48,
  },
  header: {
    alignItems: 'center',
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 0,
  },
  logoUni: {
    color: C.white,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
  },
  logoCopa: {
    color: '#CC2222',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1,
    marginRight: 10,
  },
  titulo: {
    color: C.white,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 6,
    width: '100%',
    textAlign: 'center',
    marginTop: 2,
  },
  filtroScroll: {
    maxHeight: 46,
    marginBottom: 6,
  },
  filtroContent: {
    paddingHorizontal: 12,
    gap: 8,
    alignItems: 'center',
  },
  faseBotao: {
  paddingHorizontal: 14,
  paddingVertical: 7,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: C.cardBorder,
  backgroundColor: C.card,
  marginRight: 8,
  height: 34,
  justifyContent: 'center',
  alignItems: 'center',
},
  faseBotaoAtivo: {
    backgroundColor: C.gold,
    borderColor: C.gold,
  },
  faseTexto: {
  color: C.gray,
  fontSize: 12,
  fontWeight: '600',
  lineHeight: 16,
},
  faseTextoAtivo: {
    color: C.bg,
    fontWeight: '800',
  },
  lista: {
    paddingHorizontal: 14,
    paddingBottom: 30,
  },
  dataHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  dataLinha: {
    flex: 1,
    height: 1,
    backgroundColor: C.gold,
    opacity: 0.35,
  },
  dataTexto: {
    color: C.gold,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginHorizontal: 12,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: C.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.cardBorder,
    marginBottom: 10,
  },
  cardFinal: {
    borderColor: C.gold,
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
  },
  cardGrupo: {
    color: C.gold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  cardHora: {
    color: C.white,
    fontSize: 16,
    fontWeight: '900',
  },
  confronto: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  time: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  timeSigla: {
    color: C.white,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
  vsContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  vsTexto: {
    color: C.gray,
    fontSize: 13,
    fontWeight: '700',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: C.grayDark,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardEstadio: {
    color: C.gray,
    fontSize: 11,
    flex: 1,
  },
  cardCidade: {
    color: C.gray,
    fontSize: 10,
    textAlign: 'right',
    flex: 1,
  },
  bandeiraPlaceholder: {
    backgroundColor: C.grayDark,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});