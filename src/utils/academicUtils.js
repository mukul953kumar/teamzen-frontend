// Academic status & automatic graduation year calculator
export const getAcademicStatus = (user) => {
  const currentYear = new Date().getFullYear()
  
  // Calculate startYear and endYear
  const userYear = Number(user?.year) || 1
  const defaultStartYear = currentYear - (userYear - 1)
  
  const startYear = Number(user?.startYear) || defaultStartYear
  const endYear = Number(user?.endYear) || (startYear + 4)
  
  const isPassedOut = currentYear >= endYear
  const calculatedYear = Math.min(4, Math.max(1, currentYear - startYear + 1))

  let yearDisplay = ''
  if (isPassedOut) {
    yearDisplay = `🎓 Graduate (Batch of ${endYear})`
  } else {
    yearDisplay = `Year ${calculatedYear} (${startYear} - ${endYear})`
  }

  return {
    startYear,
    endYear,
    currentYear,
    calculatedYear,
    isPassedOut,
    yearDisplay,
    batchRange: `${startYear} - ${endYear}`
  }
}

// Dynamic Year Range Generators for Profile Edit & Registration Forms
export const getStartYearOptions = () => {
  const currentYear = new Date().getFullYear()
  const years = []
  // Options from 2018 up to at least 2031 (or currentYear + 5) for future students
  const minYear = 2018
  const maxYear = Math.max(2031, currentYear + 5)
  for (let y = minYear; y <= maxYear; y++) {
    years.push(y)
  }
  return years
}

export const getEndYearOptions = (selectedStartYear = null) => {
  const currentYear = new Date().getFullYear()
  const start = Number(selectedStartYear) || (currentYear - 2)
  const minPassoutYear = Math.min(2022, start + 3)
  const maxPassoutYear = Math.max(2035, currentYear + 10)
  const years = []
  for (let y = minPassoutYear; y <= maxPassoutYear; y++) {
    years.push(y)
  }
  return years
}
