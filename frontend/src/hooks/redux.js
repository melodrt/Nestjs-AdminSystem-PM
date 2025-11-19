import { useDispatch, useSelector } from 'react-redux';

// Hooks tipados para usar Redux
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

