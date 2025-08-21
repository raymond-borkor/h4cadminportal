import MediaUploader from '../components/MediaUploader'; 
import { Card } from '../components/Field'; 
import toast from 'react-hot-toast'; 
export default function Media(){ return (<div className='space-y-6'><Card title='Media Library'><MediaUploader onSelect={()=>toast.success('Selected')} /></Card></div>) }
