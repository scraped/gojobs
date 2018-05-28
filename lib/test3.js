function isBitSet(a, b){
	return 0 != (a & 1 << b);
}

const warp = isBitSet(mask, 27);
