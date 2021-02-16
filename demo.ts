import { Add } from './numbers'

type x = [0, 1, 0, 1, 1] // 11
type y = [0, 1, 1, 1, 0] // 14
type test = Add<x, y>
