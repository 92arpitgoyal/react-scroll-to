// Robert Penner's easeInOutQuad - http://robertpenner.com/easing/
export function easeInOutQuad(time, startPos, newPos, duration) {
  time /= duration / 2;
  if (time < 1) {
    return (newPos / 2) * time * time + startPos;
  }

  time--;
  return (-newPos / 2) * (time * (time - 2) - 1) + startPos;
}
