export const setScalingFactorTo = scaleFactor => mesh => mesh.scaling.set( scaleFactor, scaleFactor, scaleFactor );
export const assignPositionTo = vec3 => mesh => mesh.position = vec3;