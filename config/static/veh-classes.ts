export type vehClasses = {
  [classShortName: string]: {
    name: string;
    type?: string;
  }
}

export const classes: vehClasses = {
  com: {
    name: 'Compacts'
  },

  cou: {
    name: 'Coupes'
  },

  cyc: {
    name: 'Cycles'
  },

  ind: {
    name: 'Industrial'
  },

  mot: {
    name: 'Motorcycles'
  },

  mus: {
    name: 'Muscle'
  },

  ofr: {
    name: 'Off-Road',
  },

  sed: {
    name: 'Sedans'
  },

  spe: {
    name: 'Special'
  },

  spo: {
    name: 'Sports'
  },

  spc: {
    name: 'Sports Classics'
  },

  sup: {
    name: 'Super'
  },

  suv: {
    name: 'SUVs'
  },

  uti: {
    name: 'Utility'
  },

  van: {
    name: 'Vans'
  },

  hel: {
    name: 'Helicopters',
    type: 'air'
  },

  pln: {
    name: 'Planes',
    type: 'air'
  },

  boa: {
    name: 'Boats',
    type: 'water'
  }
}
