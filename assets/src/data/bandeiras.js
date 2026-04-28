// Mapeamento sigla → código ISO de país para a API flagcdn.com
export const BANDEIRA_URL = (sigla) => {
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