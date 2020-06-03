import { LevelKey } from '../../constants/level';
import { Actions, ActionTypes } from '../actions';

const initialSelectedLevels: LevelKey[] = [];

export const selectedLevels = (selectedLevels = initialSelectedLevels, action: Actions) => {
  switch (action.type) {
    case ActionTypes.SELECT_LEVEL:
      return [...selectedLevels, action.payload];
    case ActionTypes.DESELECT_LEVEL:
      return selectedLevels.filter((level) => level !== action.payload);
    default:
      return selectedLevels;
  }
};
