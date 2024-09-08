#!/bin/sh

taxon=$1
dir=$2
flag_slot1=$3
flag_slot2=$4

datasets summary genome taxon ${taxon} ${flag_slot1} ${flag_slot2} | python -m json.tool > ${dir}/${taxon}.json