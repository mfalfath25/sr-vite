import moment from 'moment'
import { AnsweredQuestion, Training, History } from '../types/model'

export const getTotalTraining = (data: History[]): number => {
  return data.length
}

export const getAverageWpm = (data: History[]): number => {
  const totalWpm = data.reduce(
    (acc, curr) => (filterModes(data).length === 0 ? 0 : acc + curr.wpm),
    0
  )
  return Math.round(totalWpm / data.length)
}

export const getAverageAccuracy = (data: History[]): number => {
  const totalAccuracy = data.reduce(
    (acc, curr) => (filterModes(data).length === 0 ? 0 : acc + curr.accuracy),
    0
  )
  return Math.round(totalAccuracy / data.length)
}

export const filterModes = (data: History[]): History[] => {
  return data.filter((item) => item.mode !== 'Custom')
}

export const getTotalAccuracy = (data: Training, answer: AnsweredQuestion[]): number => {
  const questions = data.text.questions?.allQuestions
  let totalCorrectAnswers = 0
  if (questions !== undefined) {
    for (const [index, value] of questions.entries()) {
      for (const [index2, value2] of value.answerOptions.entries()) {
        if (value2.isCorrect === true) {
          if (answer[index].toString() === value2.answerText) {
            totalCorrectAnswers += 1
          }
        }
      }
    }
  } else {
    totalCorrectAnswers = 0
  }
  return getAccuracyPercentage(totalCorrectAnswers, answer)
}

export const getAccuracyPercentage = (
  correctAnswers: number = 0,
  answer: AnsweredQuestion[]
): number => {
  const totalCorrectAnswers = (correctAnswers / answer.length) * 100
  return Math.round(totalCorrectAnswers)
}

export const getTotalReadTime = (data: History[]): number => {
  const totalReadTime = data.reduce((acc, curr) => acc + curr.readTime, 0)
  return totalReadTime
}

export const getFormattedReadTime = (readTime: number): string => {
  const output = moment.utc(readTime).format('mm[m]:ss[s]')
  return output
}

export const getTotalFormattedReadTime = (data: History[]): string => {
  const totalReadTime = getTotalReadTime(data)
  const output = getFormattedReadTime(totalReadTime)
  return output
}

export const getFormattedReadDate = (date: History[] = [], mode: string): string[] => {
  let output = []
  for (const item of date) {
    if (item.mode === mode) {
      output.push(moment(item.readDate).format('DD/MM/YYYY'))
    }
  }
  return output
}

export const getFilteredData = (data: History[], mode: string): History[] => {
  let output = data.filter((item) => item.mode === mode)
  return output
}

export const getCurrentBlindWpm = (totalWords: number, duration: number): number => {
  return Math.round((totalWords / duration) * 60)
}

export const startTimer = (
  setReadTime: React.Dispatch<React.SetStateAction<number>>,
  setWpm: React.Dispatch<React.SetStateAction<number>>,
  totalWords: number
) => {
  let elapsedTime = 0 // in seconds
  let result = 0 // in wpm
  const interval = setInterval(() => {
    elapsedTime++ // increment time every second
    result = getCurrentBlindWpm(totalWords, elapsedTime) // calculate wpm every second
    setWpm(result) // update wpm every second
    setReadTime(elapsedTime * 1000) // update readTime every second
  }, 1000)
  return interval // return interval to be used in stopTimer()
}

export const stopTimer = (interval: number): void => {
  clearInterval(interval) // stop timer using given interval
}

export const startPerf = () => {
  performance.clearMeasures()
  performance.mark('start')
}

export const stopPerf = () => {
  performance.mark('end')
  performance.measure('read time', 'start', 'end')
  const measure = performance.getEntriesByName('read time')
  const output = Math.trunc(measure[0].duration)
  return output
}
