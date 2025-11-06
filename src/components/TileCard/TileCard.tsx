import './tiles.css'

interface Props {
  onClick: () => void,
  isActive: boolean,
  icon: string
}
export function TileCard({onClick, isActive, icon}: Props){
  return <div 
      className={`tile ${isActive ? '': 'invisible'}`}
      onClick={onClick}
     >
      <img src={icon}/>
    </div>
}
