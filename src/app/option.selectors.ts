
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { optionFeatureKey, OptionState } from './option.reducer';

export const selectOptionState = createFeatureSelector<OptionState>(optionFeatureKey);

export const selectOptionFilialName = createSelector(
    selectOptionState,
    state => state.filialname
);