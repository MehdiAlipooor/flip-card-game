import './App.css'
import { useEffect,  useMemo,  useRef, useState } from 'react';
import { generateRandomTiles } from './utils';
import { useTimer } from './hooks';
import type { TileType } from './constants';
import { TileCard } from './components';

const POSSIBLE_ACTIONS = 20;
const ALLOWABLE_TIME = 10

type TileItem = TileType & {id: number}
type SelectedItems = {
  itemOne: TileItem,
  itemTwo: TileItem
}

function App() {
  const tiles = useMemo(() => generateRandomTiles(),[]) 

  const {startTimer: startTime, isFinished} = useTimer(ALLOWABLE_TIME);

  const [correctSelectedItem, setCorrectSelectedItems] = useState<SelectedItems[] | []>([])
  const [clickedItems, setClickedItems] = useState<SelectedItems | null>(null)

  const currentSelectRef = useRef(0)

  useEffect(() =>{
    if(isFinished){
      alert('Time is finished')
    }
  },[isFinished])

  function clearSelection(){
    setTimeout(() => {
      setClickedItems(null)    
    }, 2000);
  }

  function onTileClickHandler(tile: TileItem){
    function isSelectionCorrect(firstIcon: string, secondIcon: string){
      return firstIcon === secondIcon
    }

    if(POSSIBLE_ACTIONS <= currentSelectRef.current){
      alert('Allowed clicked is finished')
      return;
    }
    
    currentSelectRef.current +=1;

    setClickedItems((prev) => {
      if(!prev?.itemOne){
        return {
          itemOne: tile
        }
      }

      const isCorrect = isSelectionCorrect(prev.itemOne.icon, tile.icon)

      const tiles = {
        itemOne: prev.itemOne,
        itemTwo: tile
      }

      if(isCorrect){
        setCorrectSelectedItems((prev) => [...prev, tiles])
      }

      clearSelection();
      currentSelectRef.current += 1

      return tiles
    })
    
  }

   /**
   * @description If the item is selected correctly earlier, should not be able to be selected
   */
  function checkPreviousCorrection(iconPath: string){
    return correctSelectedItem.find((f) => f.itemOne.icon === iconPath || f.itemTwo.icon === iconPath)
  }

  function isItemCorrect(index: number){
    return correctSelectedItem.filter((f) => f.itemOne.id === index ||f.itemTwo.id === index)
  }

    const renderTileItem = (item: TileItem, index: number) => {
    const isCorrectlySelected = isItemCorrect(index);
    
    const isImageSelected = clickedItems?.itemOne?.id === index ||
      clickedItems?.itemTwo?.id === index || isCorrectlySelected?.length
    
    return <TileCard
      key={index}
      isActive={isImageSelected}
      icon={item.icon}
      onClick={() => {
        if(checkPreviousCorrection(item.icon)){
          return
        }
        onTileClickHandler({...item, id: index})
      }}
    />
  }

  function handleStart(){  
    startTime();
  }

  const tilesList = tiles.map(renderTileItem)

  return <div className='body'>
    <button onClick={handleStart}>شروع</button>
    <br />
    <div className='wrapper'>
      {tilesList}
    </div>
  </div>
}



export default App
