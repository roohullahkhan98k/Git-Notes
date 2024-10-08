import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormattedGist } from '../models/interfaces';

interface GistState {
  selectedGist: FormattedGist & { rawContent: string } | null;
}

const initialState: GistState = {
  selectedGist: null,
};

const gistSlice = createSlice({
  name: 'gist',
  initialState,
  reducers: {
    setSelectedGist: (state, action: PayloadAction<FormattedGist & { rawContent: string }>) => {
      state.selectedGist = action.payload;
    },
    clearSelectedGist: (state) => {
      state.selectedGist = null;
    },
  },
});
export const { setSelectedGist } = gistSlice.actions;

export default gistSlice.reducer;