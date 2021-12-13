import React, { useState, useCallback } from 'react';
export const useToggle = (initialState) => {
	const [isToggled, setIsToggled] = useState(initialState)
	const toggle = useCallback(() => setIsToggled(!isToggled), [isToggled])
	return [isToggled, toggle]
}