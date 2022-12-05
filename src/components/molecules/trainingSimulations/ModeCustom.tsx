import React, { useState, useEffect } from 'react'
import { useTrainingStore } from '../../../store/TrainingStore'
import { useSettingStore } from '../../../store/SettingStore'
import { redirectAfterAnimation, startTextAnimation } from '../../../logic'
import { getTotalChunks, removeExtraWhitespaces } from '../../../logic/utils'
import { FixationSelect, renderFixationLine } from '../../molecules'
import { Button } from '../../atoms'
import { Timer } from './Timer'
import { useNavigate } from 'react-router-dom'

export const ModeCustom = () => {
  const navigate = useNavigate()
  const { isFontSerif, isJustified, fixationCount, fontColor } = useSettingStore()
  const [textAnimated, setTextAnimated] = useState<string | null>(null)
  const { animationStatus, trainingText, animatedText, toggleAnimationStatus, updateAnimatedText } =
    useTrainingStore()
  const [isRunOnce, setIsRunOnce] = useState<boolean>(false)
  // const [isDisabled, setIsDisabled] = useState<boolean>(false)

  const data = useTrainingStore((state) => state.trainingText)
  const fixationCounter = useSettingStore((state) => state.fixationCount)

  //additional state (for blind test params)
  const [timer, setTimer] = useState<number>(0)
  const [blindWpm, setBlindWpm] = useState<number>(0)

  //simulate
  const startSimulation = () => {
    const textValue = data[data.length - 1]?.textValue
    const chunkValue = data[data.length - 1]?.chunkValue
    const wordsPerMinute = data[data.length - 1]?.wordsPerMinute
    startTextAnimation(
      textValue,
      wordsPerMinute || 250,
      chunkValue || 3,
      setTextAnimated,
      toggleAnimationStatus,
      setIsRunOnce
    )
  }

  useEffect(() => {
    if (isRunOnce === true) {
      navigate('/training/custom/result')
    }
  }, [isRunOnce])

  return (
    <>
      <div className="w-full xl:w-[800px] 2xl:w-2/3 mx-auto space-y-4">
        <div>
          <label className="label px-0 font-bold">
            Custom text, Chunk count: {data[data.length - 1]?.chunkValue}, Target WPM:{' '}
            {data[data.length - 1]?.wordsPerMinute}
          </label>
          <div className="w-full min-h-[400px] relative outline outline-offset-0 outline-1 p-0 rounded-md bg-slate-100">
            {renderFixationLine(fixationCounter)}
            <pre
              className="relative whitespace-pre-line text-left text-base sm:text-xl font-normal p-2"
              style={{
                fontFamily: isFontSerif ? 'Literata' : 'Source Sans Pro',
                textAlign: isJustified ? 'justify' : 'left',
              }}
            >
              {/* {trainingText?.length > 0
            ? trainingText?.[trainingText.length - 1].textValue
            : 'Your custom text will be shown here'} */}
              {data.length !== 0
                ? data[data.length - 1].textValue
                : 'Your custom text will be shown here'}
            </pre>
            <pre
              className="absolute top-0 whitespace-pre-line text-left text-base sm:text-xl font-normal p-2 text-black dark:text-slate-200"
              // text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-red-400
              style={{
                fontFamily: isFontSerif ? 'Literata' : 'Source Sans Pro',
                textAlign: isJustified ? 'justify' : 'left',
                color: fontColor,
              }}
            >
              {textAnimated}
            </pre>
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            text="Start"
            weight="primary"
            disabled={animationStatus}
            width="full"
            onClick={() => {
              startSimulation()
              toggleAnimationStatus()
              // setIsDisabled(true)
            }}
          />
        </div>

        {/* <Timer
            time={timer}
            setTime={setTimer}
            wpm={blindWpm}
            setWpm={setBlindWpm}
            totalChunk={getTotalChunks(removeExtraWhitespaces(data[data.length - 1]?.textValue))}
          />
          <div>
            Total words (Whitespaces removed):{' '}
            {getTotalChunks(removeExtraWhitespaces(data[data.length - 1]?.textValue))}
          </div> */}
      </div>
    </>
  )
}