import { Add, Subtr, LT } from './data/Int'

type x = [0, 1, 0, 1, 1] // 11
type y = [0, 1, 1, 1, 0] // 14

type test_add = Add<x, y>
type test_subtr = Subtr<y, x>
type test_less_than = LT<x, y>
