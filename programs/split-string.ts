import * as Str from "../data/String"
import * as List from "../data/List"

type x = Str.Split<"a,b,123123,k,kiro", ",">
type z = Str.Split<"a--b--123123--k--kiro", "--">

type x_eq_z = List.Eq<x, z>

type y = Str.Split<"__aa__bbb__ccc__", "__">

type x_eq_y = List.Eq<x, y>
