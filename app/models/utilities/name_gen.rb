# frozen_string_literal: true

class NameGen
  attr_accessor :names

  # Humanoid Name parts
  @num_syllables = [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 4]
  @surname_types = [:normal, :normal, :normal, :english, :english, :scottish]
  @names = {
    vileAndCrude: {
      small: %w[ach adz ak ark az balg bilg blid blig blok blot bolg bot bug burk dokh drik driz duf flug ga gad gag gah gak gar gat gaz ghag ghak git glag glak glat glig gliz glok gnat gog grak grat guk hig irk kak khad krig lag lak lig likk loz luk mak maz miz mub nad nag naz nikk nogg nok nukk rag rak rat rok shrig shuk skrag skug slai slig slog sna snag snark snat snig snik snit sog spik stogg tog urf vark yad yagg yak yark yarp yig yip zat zib zit ziz],
      medium: %w[ag aug bad bag bakh bash baz blag brag brog bruz dag dakk darg dob dog drab dug dur gash ghaz glakh glaz glob glol gluf glur gnarl gnash gnub gob gokh gol golk gor grakh grash grath graz grot grub grud gud gut hag hakk hrat hrog hrug khag khar krag krud lakh lash lob lub lud luf luk molk muk muz nar ogg olg rag rash rogg rorg rot rud ruft rug rut shad shag shak shaz shog skar skulg slur snar snorl snub snurr sod stulg thak trog ug umsh ung uth yakh yash yob zahk zog],
      large: %w[argh barsh bog burz dof drok drub drug dub dug dul dursh dush duz faug fug ghakh ghar ghash ghol ghor ghukk ghul glub glud glug gluz gom grad grash grob grogg grok grol gru gruf gruk grul grum grumf grut gruz guhl gulv hai hrung hur hurg kai klob krod kug kulk kur lorg lug lukh lum lurz lush luz makh maug molg mud mug mul murk muzd nakh narg obb rolb rukh ruz sharg shruf shud shug shur shuz slub slud slug snad snog thrag thulk thurk trug ulg ur urd urgh urkh uz yug yur zud zug]
    },
    primitive: {
      names: %w[ahg baod beegh bohr bul buli burh buri chah dhak digri dum eghi ehm faogh feehm ghad ghah gham ghan ghat ghaw ghee ghish ghug giree gonkh goun goush guh gunri hah hani haogh hatoo heghi heh hoo houm hree ig kham khan khaz khee khem khuri logh lugh maoh meh mogh mouh mugh naoh naroo nham nuh ob oli orf ough ouh peh pogh pugh puh quagi rahoo rhoo rifoo ronkh rouk saom saori shehi shlo shom shour shul snaoh suhi suth teb thom toudh tregh tuhli ub urush ush vuh wah wuh yaum yauth yeeh yih yuh zham],
      suffixes: %w[doh rei mih fah soh lah tih daoh]
    },
    doughty: {
      syllables: %w[bal durn na bord from nor born fror nord brim fuld orm brod fund skand brokk gim skond brom glo storn bru gond strom bur gord stur burl gorm sturl da grad sund dal grim thor dolg grod thorn dor grom thra dorm guld thro dral gund throl drim gur thror drom hord thru dur horn thrur durm hra thund],
      maleSuffixes: %w[bor din in in in ir li li lin nir or ri ri rin rok ror rur vi vir vor],
      femaleSuffixes: %w[bis da dis dis dis dis ga hild is is lif lind lis na nis ris rith run run vis]
    },
    homely: {
      syllables: %w[ad blanc falc mil adel boff ferd mung adr bomb frob frod bilb od ail bram fulb oth alb bung gam sab alm droc hald sam amb drog ham seg band durl hasc serl bard emm hod tob ben erd hug wan biff ern iv wig bild ever mark wyd],
      maleSuffixes: %w[ald ard ert fast o o o o o old win wise],
      femaleSuffixes: %w[a a a a a ia ia ice ily ina wina wisa]
    },
    familyName: {
      english: %w[Adshead Akers Antell Applegarth Babb Babbs Baffin Bagg Baggett Bagnall Baldey Bamber Bark Barling Barnstable Barraclough Bastable Bastin Bather Batkin Batt Bazley Bebb Beddall Beeby Beecroft Beedell Bellis Belsey Berridge Besley Bibby Bickle Biddle Biddulph Bigg Binks Binns Bisp Biss Blenk Blenkin Boam Bobo Boddington Boffey Bonger Bonney Bonser Borrett Bossey Botterill Botting Bottom Bottomley Botwright Bowser Bracher Brasnett Brayley Breary Brickwood Brindley Broadfoot Broadribb Brocksopp Broster Buckmaster Budge Buffard Bugg Buggy Bulger Bulman Bunce Bunt Burrow Bushby Buss Cade Cadwaller Cantrill Cardno Catlow Cattermole Chaffe Chaffer Chard Chettle Chilcott Chitty Chivers Chubb Chugg Clewes Coaker Cobden Cobley Coggan Coggins Collop Coney Coote Copp Coppard Cornock Cossey Cottle Coultip Crang Crimp Croom Crowles Cubitt Cullimore Cuss Custance Cuthbert Dabbin Dabbing Dabbs Dagg Dainty Deeley Derrick Dibb Dibble Diccox Diggins Diggle Diggles Digweed Dimmock Dinsdale Dipple Dobbie Dobby Doggett Dorey Drabble Draycott Dring Drudge Duffield Dufty Duggan Duggleby Dumbrell Dunkley Eatwell Eggins Entwistle Erlam Etchells Fairclough Felgate Fensome Fenton Fidge Fidoe Figg Filer Fincham Firkins Flann Flanner Flippance Flook Flunder Followes Fooks Fremlin Frisby Frogley Frohock Froome Frow Fuggle Furse Furze Gabb Gaffey Gagg Gander Garbutt Garlick Garn Gazard Gedge Giblett Giddy Gigg Gilliat Gimble Gimson Ginger Gipps Girdler Gissing Gleave Goggin Gollogly Gomm Goodier Gook Gorringe Gorwyn Gosden Gribble Grigg Griggs Grill Grimble Grimes Grimshaw Grist Grubb Guckeen Guckian Guild Gull Gully Gumbold Gummer Gummidge Gurden Haffenden Hales Halse Harpham Hartle Hatch Hayhurst Hearle Henley Henwood Heppell Herrick Herring Hesketh Hext Hicken Hickmott Higman Hinchcliffe Hindmarsh Hobley Hoddy Hogben Holdom Hollick Holtom Honeysett Hook Hopley Hopps Horrocks Horsfall Horwood Hotten Housely Howie Huff Huffam Hutton Huxtable Icke Idden Inskip Iveson Izzard Jaggs Jellis Jepson Jesty Keel Keetley Kerkin Kerslake Kettley Killick Kinch Knaggs Kneebone Knopp Knott Lagden Laslett Laverick Leaper Leggett Liddane Liddy Liggan Lithgoe Lobb Lodder Looby Loody Lubbock Luff Lugard Lugg Lumsden Lyle Mabb Mabbitt Mabbot Mabbs Mabbutt Maffey Mallam Mangold Mapp Mappin Marfell Matthams Maunder Maxted Mayo Meech Meeson Meggison Meggitt Meggs Mellings Merrikin Metherell Mew Miggles Miggs Milsom Milson Minchin Minns Mobbs Moberly Mockler Mogford Mogg Moggs Morkam Morphett Mossman Mossop Mottershead Moulds Muddle Muddock Mudge Mullock Murch Murfin Murfitt Musson Mustill Mutter Mutton Nance Napper Neep Negus Netherway Newitt Niblett Nickless Noad Nobbs Noblet Nosworthy Nottage Nutt Offen Oram Orcutt Ord Orpe Paddock Paddon Pannell Parham Pavey Peay Peever Pegg Pegge Pegler Pegrum Pelly Pelter Pendle Petch Petcher Petchey Pettipher Philp Phippen Phippin Pickersgill Pickley Pickwell Pidduck Pigg Pilkington Pimblett Pingree Pinch Pinn Pither Pochin Poggs Polkinghorne Pomeroy Pomfret Postlethwaite Potticary Poxon Pring Pringle Prisk Proudfoot Puddicombe Pudding Puddy Pugsley Purslove Pym Quaife Quain Quenby Quibell Quigg Raddle Ranby Rapkins Ratter Reakes Reeson Riddle Rix Roddis Rosser Ruddle Ruffle Rugg Rumming Rump Sadd Samways Sankey Scantlebury Scoones Scouse Scragg Scrimgeour Scroggs Scruby Scutt Sefton Selth Semmens Seward Shalloo Sharples Siggers Sirett Skeels Skerrett Slee Sluggett Smedley Snoddy Snuggs Sparrow Sparrowhawke Spink Spinks Spriggs Springett Sproat Sprunt Spurle Spurrett Spurrier Squance Squarey Squibb Squirrel Staines Steggal Stelfox Stirk Stith Strag Straw Strutt Stubbins Stuppies Suggett Swaffer Swaffield Swarbrick Symes Tabor Tagg Tapping Tarr Tassell Teale Thew Thick Thornber Thwaites Tibbins Tibbits Tibbles Tibbotts Tink Tippell Tipping Tippins Tippling Tipton Tisser Tittmuss Tobitt Tonks Topping Towse Toye Tozer Trafford Treasure Tremlett Trett Trible Tricker Tripe Trippe Tripper Trist Troake Trotter Trouncer Trumble Tudge Tuffin Tufley Tulk Tully Tumman Tunks Tunnah Tunnicliffe Turnock Tween Tyrer Unsworth Uttley Varney Vooght Wackrill Waddilove Waddilow Walthew Waltho Walwin Wanless Wann Waple Waring Warrilow Welburn Wenden Werrett Wescott Whinnett Whiskard Whisker Whitefoot Whitlow Wibberley Widdicombe Widdows Widdup Wigg Wigley Wilberforce Wilmer Wintle Witherden Witney Witter Wolnoth Woodhead Wookey Woolland Woombill Worrel Worsley Wortley Wragg Wrixon Yeandle Yeend Yemm Yould],
      scottish: %w[Aiken Aitken Baikie Baillie Bainbridge Baird Bairnsfeather Balios Balnaves Barbour Barclay Barrie Beattie Beilby Bell Bellenden Berwick Blackie Blackwood Blaikie Blair Bogue Boyce Braid Brechin Brisbane Brough Brougham Brown Brownlee Brymner Cairns Calderwood Candlish Cardus Cargill Caven Christison Clyde Cochran Cochrane Cockburn Colomb Crockett Cronin Cruden Cunningham Cushny Dalziel Deems Dempster Dinwiddie Doohan Doone Dunbar Dundas Dundee Dunn Dunning Eccles Eckford Edmonstone Elder Fairbairn Falconer Fenwick Ferrier Gairdner Galloway Galt Geddes Geikie Glass Glendon Graham Gregory Guthrie Haig Halkett Herdman Hogg Imey Inchbald Inglis Irvine Ivory Jebb Kerr Kircaldy Kirk Kirkbride Laird Laughlin Lawson Legge Lillie Lipton Lockhart Lorimer Lyall Lyte Masson Melrose Mill Miller Milligan Milner Moffat Mollison Moncrief Montrose Motherwell Muir Muirhead Murray Nairn Naysmith Nesbit Nisbet Noël Orchardson Pasley Paterson Pender Preston Primrose Pringle Quiller Raeburn Ransay Redpath Renfrew Rennie Renwick Sanderson Semphill Smiles Smollett Smybert Spenlove Sterling Stirling Strang Strange Strangeways Tait Tannahill Tassie Thom Tolmie Urquhart Wardlaw Wedderburn Whearty Wilkie Wiseheart Wishart Yarrow]
    },
    fairAndNoble: {
      elf_prefixes: %w[an im ar in cal ir car ist cel lar cir lir clar lor el mar elb mel er mer erl mir est nim far nin fin nir gal ral gan ran gar rel gel ril gil rin ilm rim],
      alternativeelf_prefixes: %w[aeg lith ael maeg aer mind aes mith aeth nith bel rael ber rind cael saer caer sar cris seld ear ser elth sil eol silm faer sind fean thael find thaer ith thal laeg thel lend ther lind thir],
      middle: %w[ad al am an ar as eb ed el em en er es ev il in ir ol thal thon],
      maleSuffixes: %w[ad dan del dil dir fal ion ion lad las lin nar or orn ras rior rod rond ros thir],
      femaleSuffixes: %w[edel el eth ian iel iel ien loth mir rial rian riel riel rien ril roël sil wë wen wen]
    },
    faerykind: {
      prefixes: %w[dex gliss tink flax goss tiss flim hex trill fliss liss trist flix min twill foss misk twiss frisk raff twisp friss ress twix gess riff weft glan rill wesk glax saff winn glim shim wisp],
      maleSuffixes: %w[aldo allo amo ando aroll aron asto endo eroll eron esto ondo],
      femaleSuffixes: %w[afer amer anel arel asti efer enti erel ifer imer inel irel]
    },
    alternativeFaerykind: {
      prefixes: %w[bris iphil opal cryl ispel oris elsi istle orif ember jat peri esk jost sarm feris jus sprin frimi lirra stith gan mali tansi glink mink tirra hal mirra trump hel mistle whis hist ninka zando],
      maleSuffixes: %w[bik brix frell fret kin mist mit rix tross twik win zisk],
      femaleSuffixes: %w[dee kiss la liss mee niss nyx ree riss sa tiss ynx]
    },
    elegantEvil: {
      prefixesDarkElves: %w[bal myr ber ne char nel de nil div no dri nyl dul rel eil rha ek ru im sab ins sin ist sul jeg sus jer tel jys tul lil ver mar vil mer vir mez vril mor yas],
      prefixesAlternateDarkElves: %w[bur olg chor on col or dol org dor oth drom pan dur pel en por er sek gon sol gul sun jend ten kil thal lul tor mab torm maz vek mol vol nor vor noth yel ol yol],
      middle: %w[dyl el en er id il is lav len lev lin liv pel pir ra ral ril rin sin syl],
      maleSuffixes: %w[ald eld id ild ird lim naz nid nil nim red rid rim riv ul uld vid vim vir viz],
      femaleSuffixes: %w[bra dra dril ene hel ia il iln ira istra ith iza lin na ra rin sil tra vra vril]
    },
    malevolent: {
      prefixes: %w[aag karg ulthu alur khark urz arak krau uti az kriv uznid azik kuaz virn bral kudu vlaaj braz luri vlag bruh mulk vlash draan nau vluk drulg nid vluzak guz ninj vraz haug nul vulk idru nym xau jhaal ranag xid jid rilthu xul jiu ruk xuraj jur rulk zauv jurg ruz zug jurz saag zuldu kaaz skaur zuv],
      maleSuffixes: %w[arag bru drul inu lank lun lurr lurug nal rul ruzuk salk sul suruk ull undak uvik xulg zu zuk],
      femaleSuffixes: %w[anil bau diu dusla giu ija izil jiul lihyl lin lyrr nalu rhyl rula skiu sula ulla xhiu zihyl ziu]
    },
    draconic: {
      prefixes: %w[abra har phrixu adastra helio porphyro adra huro pyra anca iul rhada andra jalan rhe arag jarzem rhodo archo jazra rau atra jurga sar bar keruxa sarcu bara kralka sarda beru lazulo scarva bhakri majuri sidereo bia malacho skhia bra mar sulchru brado marmora tchalcedo brima melkar tchazar cadra orgra trocho chro ouro vra chryso perido zalar glau phoro zerul],
      suffixes: %w[bazius boros bradax calchax cordax lagon malax mandros manthys mordax nadral nalux neriax phylax vorax vorung xenor zuthrax zzebrax zzemal]
    },
    infernal: {
      softs: %w[alu alz avu azaz baph baz cha fraz garl garu gla hra mal nahu nal nasu paz raz tha thalu bre dre gel gle gre hez rez rezu tze gzi hriz hzi idrau itha ixu lilu riz yil dromu gro lol moz olth oxu sco tho bu bul buz chru dru ghu gura guz hruz huz kul lurhz muz ru shu ssu szul thu ulchru utu vul zu zul baal ghaa kraa phaal raal saa bial oazo soaz ruaz gya yaa bael nee ziel yee aiaz shai reoz duoi drau ghau glau mau sau tzau iuz juu rhuu vuul zuu],
      dulls: %w[agh alg barg chag ghad glab grag hrag kag kwarg mag nalb sag tharg brelg dergh dregh drelb felg heg kleg igg rigg blog drog grolb kolg krolg lolg mog morg nog obb ogg olb rogg strog thog trob tzolg vogt bub bulg druj durg frub fulg gub hrud hurg jub julb nud nug nulb rung shub stug sug szug trulg ulb urb vub vulb xub zub zug zugt aab aag glaag haag naag raag boaj moab uag leegh yeb yeeg aig yibb iog droog nyog aug baug daurg draug gaub laug maug naug raug saug thaug iub iug ruug],
      sharps: %w[ach akk ash azt bahor bar bas brax charn dak hrax lach lazt mat nam nazt ralk rhast sark slarv tash thak thalur thalk vach vap dek ech fesh gek hrek lech met ner ter blik gith igm inax irsch kir lis lisk lith nilv nirr tlizit bor chon goch gor goth hoth khor kos loch lok loth moch moth noc och oth rolk roth sot soth vrok dun gur hun luth muth nur rutt sut sutt szut tur urt utuk uzt krych nyth slyth gaan xaas boak ruaak yalm haerx iex draum gaur glaur rauk saur duum nuur ruun]
    },
    empyreal: {
      prefixes: %w[adan asan jasan palant sarnat valmar adrast asarn jasarm palor solar valnar alant astar javral raman talan valnor amad atar kalad ranal talar valon aman atlan kalar ranar talas valor amar avar kalas rasan talon vanar amars avlant kalast ravan taran varal amart avral kasal samar taval varam ansam jalan katarn saran valant varan arad jalkar kaval sarat valar varat aram jaran klaron sardan valdor vardar aran jasal palad sardar valkar voltar],
      maleSuffixes: %w[al an ar as at ath ath ath anth athal athar athas],
      femaleSuffixes: %w[el en er es et eth eth eth enth eleth ereth eseth],
      titles: %w[ar- sar- tar- var- jal- kal- pal- ral- tal-]
    }
  }

  #Tavern Name parts
  @tavern_patterns = [
    '<adjective> <noun>',
    '<adjective> <noun> <title>',
    'The <adjective> <noun>',
    'The <adjective> <noun> <title>',
    '<noun> & <noun>',
    '<noun> & <noun> <title>',
    '<adjective> <title>',
    'The <adjective> <title>'
  ]
  @tavern_nouns = %w[dog wolf fox cat lion tiger kitten ox cow sow bull calf horse stallion mare foal owl eagle falcon hawk raven crow gull fish whale shark octopus squid goat sheep ewe fly butterfly dragonfly beetle ant wasp termite louse worm lizard frog toad snake chameleon unicorn gryphon dragon wyvern roc clam oyster starfish slug snail mouse rat beaver marten mink otter seal manatee chipmunk squirrel gopher tower castle dagger sword bow arrow hat boot trophy goose duck boat ship river falls forest mountain vampire skeleton witch wench lady lord knight drunk shield wand helm flask flagon pint shot]
  @tavern_adjectives = %w[red orange yellow green blue purple sanguine sepia ochre puce navy maroon pink peach cyan violet brown black gray white silver gold jumping sleeping running rolling laughing singing flying burning swimming crying roaring screaming silent petrified hiding hidden lost forgotten shiny drowning giant tiny fat skinny humorous lonely drunken slimy undead dark bright magical enchanted poor wealthy lucky unfortunate angry happy sad thieving desperate divine arcane profane discreet buried false foolish flatulent hypnotic haunted special fun drab daring stubborn sober talking naked suffering cheap smelly easy heroic hovering married pious pompous illegal sacred defiled spoilt wooden bloody yawning sleepy hungry]
  @tavern_titles = ['bar', 'brew house', 'beer house', 'mead house', 'ale house', 'speakeasy', 'pub', 'lounge', 'brewery', 'loft', 'club house', 'inn', 'tavern', 'den', 'lodge']


  class << self
    MALE_FIRST_NAMES = %w[Aalart Aalot Abel Abelot Aberardus Acelin Acot Acur Adam Adame Addie Addy Ade Adeite Adekin Adelard Adelardus Ademar Adenot Adequin Aderlard Adhemar Adie Adinet Adkin Adlard Adri Aimeri Aimeriguet Aimery Aitken Alain Alainon Alan Alane Alanus Alard Alart Alcock Aldis Aldo Aldous Aldus Alein Aleyn Aleyne Alfan Alfonce Allan Allen Alleyn Almeric Almericus Alphonse Alphonsins Alphonsus Althalos Amaud Amauri Amaurri Amaury Amer Americ Americus Amery Amfrid Amfridus Ancel Ancelin Ancelm Ancelmus Ancelot Anchier Anderewe Andreas Andreu Andrew Andri Andriet Andrion Andriu Androu Androuet Andruche Andry Andryr Anfroi Anfroy Anscoul Anselet Ansell Ansellus Anselm Anselme Anselmet Anselmus Ansfrid Ansfroi Ansger Ansgot Ansiau Ansout Ansure Armand Armant Armin Armine Arminel Armundus Arnald Arnaldus Arnaud Arnaut Arnet Arnold Arnoldus Arnott Arnould Arter Arther Artheur Arthur Arthurius Arthurus Artor Artos Artur Arturus Artus Asce Ascelin Ascelyn Asher Asselin Athelard Athelardus Atkin Audemar Audouin Audri Audry Auguinare Aunger Aunsellus Aurri Ausout Averardus Averet Averitt Aylard Aymer Aymeri Aymon Azelinus Azemar Azer Azorius Azur Badcock Balan Balian Balin Barat Barda Bardol Bardolf Bardolph Bardolphus Bardulphus Baret Barnabas Barnabe Barnaby Barnard Barnet Barret Barrett Bart Bartel Bartelemi Bartelmeu Bartelot Bartholomeus Bartholomew Bartle Bartlet Bartly Bartolomeus Bartram Bartrem Barty Basequin Basewin Basuin Bat Batcock Batkin Batsuen Batty Bausan Bayard Baynard Belin Benedict Beneger Benger Berengar Berengarius Berenger Berengerius Berengerus Berengier Beri Beringer Berinon Bernar Bernard Bernardus Bernart Bernier Berold Beroldus Berolt Bert Bertaut Bertelemi Bertelemy Bertelot Berteram Berthellemy Bertie Bertin Bertol Bertram Bertramus Bertran Bertrand Bertrannus Bertrant Bertylmew Betan Betin Betyn Beuves Beves Bevis Blaive Blavier Blayves Bob Bobbie Bobby Bobs Borin Botolf Botolfe Botolph Botulf Brian Brianus Brice Bricet Briceus Bricot Brien Brienus Britius Brom Bruiant Bryan Bryant Bryce Carac Carle Cassius Cedric Challes Charle Charles Charlet Charlot Charlys Christian Christie Christofarus Christofle Christofre Christofur Christopher Christopherus Christouer Christy Clarembaut Clarenbald Clerebald Clerebold Clerenbald Clifton Col Colart Cole Colet Colin Colinet Colinus Collett Colley Colyne Conan Conandus Conanus Conayn Conon Conrad Conradin Courtois Crestiennet Cristal Cristall Cristoffle Cristoforus Cristofre Cristole Crystall Crysteffor Crystoll Curteis Curtis Dafydd Dain Dandi Dandy Dane Daniau Daniel Dannet Danyau Danyel Danyell Danyll Daue Dauid Dave Davi David Davie Davit Davy Daw Dawkin Dederic Dederick Dedericus Degarre Degore Derek Derric Derrick Deryk Destrian Diccon Dick Dicken Dickie Dickon Dickory Dicky Diggin Diggory Digory Dob Dobbin Dodd Dodge Donald Donaldus Doneuuald Doran Dowd Drake Drest Dreu Dreue Dreues Drew Drewett Droart Droet Drogo Drouet Droyn Dru Drue Druet Druettus Drugo Drust Drystan Dump Dumphey Dumphry Dumpty Dyryke Ebrardus Eden Edmund Edon Edun Elias Elies Eliot Elis Eluard Elyas Elye Elyes Elyot Elys Emaurri Emeric Emerick Emericus Emery Emory Engeram Engeramus Engerramet Engerran Engerrand Enguerran Enguerrand Enjorran Enjorren Erart Ernald Ernaldus Ernaut Erneis Ernis Ernest Ernisius Ernold Ernoldus Ernoul Ernoulet Ernoullet Estave Estevenot Estevot Eude Eudes Eudo Eudon Euvrouin Evenon Everard Everardus Evrardin Evrart Evrat Evrouin Fairman Faramond Fareman Faremanne Farman Farmanus Farrimond Fauques Favian Fawkes Federic Federyc Fendrel Ferand Ferant Ferentus Ferrand Ferrant Ferri Ferry Fery Filbert Folc Folcard Folke Folkes Forthwind Foucaud Foucaut Foucher Fouchier Foulk Foulque Foulqueret Fouquaut Fouque Fouques Fouquet Fowke Francis Franco Francus Frank Franque Franquet Fraunk Frederic Frederick Fredericus Frery Frideric Fulbert Fulbertus Fulchard Fulcher Fulco Fulk Fulke Fulko Gabel Gabell Gabriel Gabrien Gabryell Gaiallard Gaillard Gaillart Gale Galeran Galeren Gales Galfridus Galien Gallien Galot Galter Galterius Garin Garit Garner Garnet Garnier Garnot Garnotin Garrat Garratt Garrett Gaufridus Gaufroi Gauteron Gautier Gautzelin Gauvain Gavienus Gavin Gavinus Gawain Gawayne Gawen Gawin Gawn Gawne Gawter Gawyn Gawyne Gaylord Geffery Geffrai Geffray Geffrei Geffrey Geffroi Gefroi Gefroy Gemmes Geoff Geoffrey Geoffroi Geofridus Ger Geraint Gerald Geraldus Gerard Gerardus Gerbald Gerbaut Gerbert Gerbertus Gerbod Gerbold Gerboud Gereminus Gerente Gerfast Gernier Geroldin Geroldus Gerolt Geronim Geronimus Gerontius Gerould Gerrart Geruntius Gervais Gervaise Gervas Gervase Gervasius Gervassius Gerves Gervese Gervesin Gervesot Gervis Geubert Geuffroi Geve Gib Gibbon Gibby Gieffrinnet Gifardus Gifartus Giff Giffard Gifford Gil Gilberd Gilbert Gilbertus Gilebert Gilebertus Gilebin Gilibertus Gill Gillebertus Gillet Gilliame Gillotin Gilmyn Gilow Gilpin Gipp Giradin Giraldus Girard Girardus Girart Giraud Giraudus Giraut Giroldus Girout Gislebertus Gobert Goce Gocelinus Godafre Godbert Godebert Godefray Godefridus Godefroi Godefroy Godefry Godelot Godet Godfery Godfree Godfreed Godfrey Godfry Goffridus Goin Goisfrid Goisfridus Goscelin Goscelinus Gosfridus Goubert Gozelinus Gregory Gualter Gualterius Gualtier Guarin Guarinet Guarinus Guarnier Guerart Guerin Guerinnet Guernier Guernon Guernot Gui Guiart Guibe Guibert Guibour Guido Guilhem Guilielm Guillame Guillaume Guille Guillelmus Guillemaque Guillemet Guillemin Guillemot Guillot Guillotin Guimar Guimart Guimer Guimond Guinemar Guiot Guiraud Guiraudet Guiscard Guischard Guntard Gunter Gunterius Guy Guyat Guymar Guyon Gwalter Gwatkin Gwychardus Gwydo Gy Gyffard Gylaw Gylbard Gylbarde Gylbart Gyrard Holy Hab Hadrian Haganrich Haimmon Hal Ham Hamelen Hamelin Hameline Hamelot Hamen Hamett Hamlet Hamlin Hamlyn Hammond Hamnet Hamo Hamon Hamond Hamonet Hamund Han Hancock Hanecock Hanekin Hanequin Hank Hankin Hann Hanry Hardegin Hardi Harding Hardouin Harduinus Hardwin Harman Harry HarveyBreton Hary Haveron Hawkin Haymo Heimart Heimeri Heimon Helain Helias Helie Helies Helyas Helyes Helyot Hemarc Hemart Hemeri Hemmet Hemon Hemonnet Hendereye Hendry Henfrey Henricus Henriet Henriot Henry HenryHaimirich Heriot Herman Hermannus Hermenion Herment Hernais Hernays Herriot Herry Herve Herveus Hervey Hervi Herviet Hervoet Hervouet Hervy Heudebrand Hew Heward Hewe Hewelet Hewelin Hewerald Hewet Hewlett Heymeri Heymon Hick Hicket Hickie Higg Hildebrand Hildebrandus Hildebrant Hildebrondus Hitch Hitchcock Hob Hobard Hobb Hobbie Hodge Hodgkin Holger Honfroi Hotch Hotys Houdart Houdeet Houdin Houdoin Houdouyn How Howard Howkin Hubard Hubelet Hubert Hubertus Hubie Huchon Hud Hudd Hudde Hue Huelin Huet Huffie Hugelin Huget Hugethun Huggett Huggin Hugh Hughoc Hugin Hugline Hugo Hugolinus Hugon Huguard Hugubert Hugue Huguenin Hugues Huguet Huidemar Humfery Humfredus Humfrey Humfridus Humfrye Humph Humpherus Humphery Humphrey Humpty Hunfray Hunfridus Huon Hurrey Hutch Hutchin Iame Iames Iamys Iemes Ihon Ihone Ilberd Ilbert Ilbertus Imbart Imbert Imbertus Imgelramus Ingelram Ingelramnus Ingelrandus Ingelrannus Ingeram Ingerame Ingraham Ingram Ingramus Ingran Ingrannus Ioco Iohannes Iohn Iohne Iordanus Isaac Isac Isake Isambard Isembard Isembart Isemberd Isembert Isenbardus Ive Ives Ivo Ivon Ivone Ivote Izaak Jack Jacke Jackie Jacky Jacob Jacobus Jacominus Jacomus Jacomynus Jacquelin Jacquemin Jacques Jak Jake Jakke Jame James Jamettus Jamys Jan Janequin Jankin Janot Janshai Janyn Jaque Jaquemart Jaquemin Jaquemon Jaques Jaquet Jarin Jarvis Jasce Jaspar Jasper Jeacock Jeames Jeanin Jed Jeff Jeffcock Jeffery Jeffroy Jeffry Jehan Jehanel Jehannequin Jehannin Jehannot Jehanson Jehen Jem Jemmy Jenkin Jep Jeph Jeremiah Jeremias Jeremimum Jereminum Jeremy Jermyn Jerome Jeronim Jeronimus Jervis Jesper Jessop Jewell Joachim Joachin Job Jobba Joce Jocelin Jocelyn Jocet Joceus Jock Jodocus Joe Joel Joffridus Johannes John JohnCromwell Jon Jop Joppa Jordan Jordanus Josce Joscelin Joscelyn Josclyn Josef Josep Joseph Joses Joss Josse Josson Jourdain Jowell Joyce Judd Juel Juhel Jupp Jurdan Jurdanus Jurdi Karles Karolus Kester Kit Kitt Lambard Lambekin Lambelin Lambequin Lambert Lambertus Lambin Lambkin LanceLanzo Lancelet Lancelin Lancelot Lancelyn Lanslet Launce Launceletus Launcelot Launselot Leo Leofrick Letholdus Lewis Lief Ligart Ligier Lijart Lodewicus Looys Louis Louve Louvel Love Lovel Lovell Lovet Lowis Loys Loyset Ludovicus Mace Macey Mainard Mainardus Mainfridus Mainfroi Malcolinus Malcolm Malcolum Malculinus Malculms Malculmus Malgerius Manard Manfred Margre Marmaduc Marmaducus Marmaduke Marmedoke Maucolyn Mauger Maugier Maugre Maukolum Maynard Melcher Melchior Melmidoc Merek Mermadak Mial Micahel Michael Michel Michelet Michell Michiel Miel Mighel Mighell Mihel Mihill Mikael Mile Miles Milet Milo Milon Milot Moise Moses Moss Mosse Mosseus Mousse Moyse Moyses Myghchaell Myghell Myles Nab Neal Neale Neel Neil Nel Nele Nell Niall Nib Nichol Nicholas Nicholaus Nichole Nick Nicky Nicol Nicolas Nicolaus Nicolet Nicolin Niel Nigel Nigelle Nigellus Nigs Noah Nob Noe Noes Norman Normand Normann Normannus Noy Nycolas Nygell Odde Oddo Ode Odger Odibrand Odinel Odo Odouart Oenus Oger Ogerius Oggery Ogier Onfroi Onuphrius Otebon Otelin Otes Othes Otho Otis Otois Oton Ottie Otto Oudart Oudet Oudin Oudinet Oudinnet Ouein Ouen Ouin Oure Ourri Owain Owayne Owen Oweyn Owin Owine Owini Owun Owyne Parsefal Parzifal Paul Paule Paulin Paulinus Pawelinus Pawlin Peares Pearse Peirce Perceval Percevale Percheval Percival Percivale Percyvallus Percyvell Pereret Peres Perez Perinnet Perote Perrin Perrot Pers Persefall Persivell Peter Peterkin Petrus Petur Petyr Peyton Phareman Philbert Philibert Pierce Pierres Pierrot Piers Powel Powle Quinn Raaf Rab Rabbie Radolf Radulf Radulfus Rafe Raff Ragenald Raignald Raiimond Raimbaud Raimbaut Raimond Raimund Raimundus Rainald Rainaldus Rainard Rainerius Rainerus Rainier Ralf Ralphwolf Ran Ranald Rand Randal Randall Randle Randolph Randoul Randulfus Randull Randy Rankin Rannulf Rannulfus Ranulf Ranulfus Ranulph Ranulphus Raolet Raolin Raollet Raollin Raoul Raoulet Raoulin Rauf Rauffe Raulf Raullin Raulyn Rawkin Rawlin Raymond Raymundus Raynaldus Rayner Raynerus Raynoldus Reginald Reginalde Reginaldus Regnier Reignald Reignolde Reimfred Reimond Reimund Reinald Reinfred Reinfrid Reinfridus Reinhold Reinold Reinoldus Remfrey Remi Remon Remondin Remonnet Remont Remy Renard Renart Renaud Renaudin Renaut Renfred Renfry Renier Renodet Renoldus Renouart Renout Rex Reymnd Reynald Reynard Reynaud Reyner Reynfred Reynfrey Reynold Reynoldus Ricard Ricardus Ricaud Rich Richal Richard RichardRicher Richarde Richardin Richardus Richart Richemanus Richeut Richie Richier Rick Ricket Ricon Rique Riquebourc Riquier Rob Robard Robbie Rober Robert Robertus Robin Robinet Robion Robyn Rodbertus Roger Rogerin Rogerius Rogerus Roget Rogier Roguelin Roland Rolandus Rolant Roley Rolf Rolfe Rolft Rolland Rollant Rollin Rollo Rolph Ronald Rotbert Rotbertus Rotgerius Rouland Roulant Roule Roulf Rowan Rowland Rowley Rulf Rychard Rycharde Sadon Saer Saerus Sagar Sagard Sagarus Salaman Salamon Salemon Salmon Sam Samm Sampson Samson Sanse Sanses Sanson Sansonnet Sansum Saunsum Sayer Searl Searle Seemannus Segar Segarus Selle Selles Serell Seri Serill Serle Serlo Serlon Serrell Serrill Sewal Sewale Sewallus Sewell Sim Simcock Simkin Simmond Simon Simond Simonnet Simpkin Solomon Stefanus Sten Stephanus Stephen Steuan Steven Stevyn Sym Symkyn Symme Symon Symond Symonet Symonnet Symounde Taff Taffy Talbot Talebot Tam Tamas Tammie Tancard Tancock Tancred Tandy Tankard Tebald Tebaud Tebbe Tedbaldus Tedric Teebald Teodbald Teodric Tericius Terric Terrick Terricus Terrin Terrowin Terry Terryn Tetbald Thancred Thebaldus Theobald Theobaldus Theodoric Theodric Thibaud Thiebaut Thierri Thierry Thim Tholy Thom Thoma Thomas Thomasin Thomasinus Thomass Thomassin Thome Thomelin Thomlin Thomme Thoumas Thoumassin Thybaudin Thybaut Tib Tibald Tibaut Tibbott Tibost Tibout Tiebaut Tierri Tim Timm Tobey Tobias Tobin Toby Tobye Tobyn Tolly Toly Tom Tomas Tomkin Tommie Tommy Topaz Topher Tristan Tristian Triston Tristram Trustram Trystrem Tuyon Tybalt Tybaut Tybost Tybout Tyon Udo Udona Ulric Umfray Umfrey Umfridus Umphrey Uranius Urian Urianus Urien Uryene Uwen Valter Vasey Vauquelin Viliame Vilihame Villiame Vvillequin Walchelim Walchelin Walcher Walganus Walkelin Walkelinus Wally Walt Walter Walterius Walterus Warin Wariner Warinus Warner Warnerius Warnerus Warren Warrenus Wat Water Watkin Watkyn Watt Wattie Watty Wauter Wichard Wido Wilcock Wilecoc Wiliam Wiliame Wilkie Wilkin Will Willcock Willelm Willelmus Willet William Williame Willie Willmot Wilmot Wimarc Wimark Wiscar Wiscard Wischard Wisgarus Wy Wyat Wyliame Wylymot Wyman Wymar Wymarc Wymare Wymark Wymer Wymerus Wymon Wymond Wymund Wyon Wyschardus Xalvador Ymbert Yngerame Yon Ysaac Ysac Ysembert Yvain Yve Yves Yvet Yvon Yvone Yvonnet Yvonus Ywain Zane].freeze
    MALE_ELF_FIRST_NAME = %w[Adran Aramil Austrin Erevan Fivin Galinndan Gennal Halimath Hiimo Immeral Korfel Lamlis Quarion Rolen Theren Theriatis Uthemar Tezoth Kaelthrimar Ardyn]

    FEMALE_FIRST_NAMES = %w[Aales Aalez Aalina Aaline Aalis Aaliz Aanor Acelina Ada Adaleide Ade Adela Adelaide Adelais Adelena Adelicia Adelie Adelin Adelina Adeline Adelisa Adeliz Adeliza Adelysia Adete Adhelina Aeleis Aelesia Aelienor Aelina Aelis Aelisia Aelizia Aenor Aeschine Afra Agnes Ahelis Ahelissa Ala Alais Albray Albreda Albree Aleida Aleneite Alesia Alesone Alexia Alia Alianor Alianora Alice Alicen Alicia Alienor Alienora Alina Aline Alis Alisceon Alise Alison Alisone Alisoun Aliss Aliz Allie Allison Alot Alote Alse Alson Alycie Alyna Alyon Alys Alyson Alysone Amalone Amelia Amelina Ameline Amelinne Amelot Amelyn Ammij Ammio Ammy Anachorita Anastas Anchoret Anchoretta Ancret Ancreta Ancrett Angaret Angmar Anilla Ankerita Ankharet Ann Anna Anne Annet Annie Annot Annote Anny Anot Anote Aphra Aphrah Arabella Ariana Arlette Ascelina Asceline Ascelinne Ascelot Ascilia Asselyna Atheena Athelesia Atheleys Athelina Athelis Athelisa Athelisia Athelyna Auberee Aubourc Aubreda Aubrey Auelin Auelina Auelyna Auic Auice Auicia Auisia Auizia Auphrey Auriol Aveis Avelina Aveline Avelot Avelyn Averil Avice Avicia Avila Avilina Avin Avina Avis Ayfara Ayleth Belle Barsabe Bathia Bathsheba Bathshua Beatrice Beatrix Bela Bele Beleite Belet Bella Belle Belon Belot Belsant Belsante Berengaria Berengiere Bersaba Bess Besse Besseta Bessie Bessy Bet Beth Betha Bethan Bethia Betsy Betta Bette Betty Bibbey Bibby Bibel Bibele Bible Biby Biddy Bithiah Bragwayn Brangwayna Brangwine Branwyne Braya Bride Bridget Brigette Brigida Brigit Brigitta Brunhild Bryde Catherine Catrain Cecily Cedany Chrestienne Christaire Christian Christiana Christiania Christin Christina Claramunda Claremonde Clarimond Cleremunda Crestienne Crisly Crislye Cristan Cristeane Cristene Cristian Cristiana Cristiane Cristina Cristine Cristinia Cristy Crystina Dimia Duraina Ebbot Ebeta Ebett Ebota Edelin Edelina Edeline Edelinne Edolina Egelina Ela Eleanor Eleanora Elewisa Elewys Elezabeth Elia Elianor Elianora Elicia Elinor Elinora Elisa Elise Elison Elisot Elisota Eliza Elizabet Elizabeth Elizabetha Elizabethe Elizabetht Elizabez Elizey Elizibeth Elizibetht Ella Ellenor Ellice Ellyn Eloisa Eloise Elsa Elsie Elspat Elspet Eluned Elwisia Elyenora Elysabeth Elysande Elysant Elyscia Elyzabeth Ema Emayn Emblem Emblema Emblen Emblin Emblyn Emelenine Emelin Emelina Emeline Emelisse Emelnie Emelot Emelote Emeloth Emelyn Emelyne Emeny Emlin Emlyn Emm Emma Emme Emmelina Emmeline Emmet Emmete Emmony Emmot Emmota Emmote Emoni Emonie Emony Emota Emy Emylyna Enmeline Enndolynn Ermina Ermintrude Ermyntrude Esabel Esabell Eschina Esclairmonde Esclamonde Esobel Essylt Eua Eudeline Euot Euota Eva Eve Evelina Evelot Evelune Evelyn Evette Evota Ewe Ezabell Farfelee Gabella Gabriel Gabriela Gaenor Galiena Galiene Galienne Ganleya Ganor Gaunlaya Gaunliena Gaynore Gele Gelen Gelleia Genevieve Genevote Gennat Gennevote Gennon Geua Geue Geuecok Geva Gisella Giselle Gisellee Gisla Gismon Gloriana Godiva Gonore Gresilda Grisel Griselda Griseldis Grishild Grissall Grissel Grissell Grizel Grizzel Guanor Gueanor Guener Guenevere Guibourc Guillemete Guillote Guinevere Guiote Gunneuare Gussalen Gwendolynn Gwenhevare Gwenore Gynuara Hadwis Hadwisa Hadwise Haouys Haoys Harsent Haueis Havisa Hawis Hawisa Hawise Hawisia Hawys Hawyse Hegelina Heilewis Heilewisa Hele Heleanor Helena Helevisa Helewis Helewisa Helewise Helewys Helewyse Helisende Helisent Helissent Heloise Helouys Heloys Heloyson Helueua Helysoune Helyssent Hemin Herleva Herleve Hermesent Hermessent Hermineite Hersent Hibbot Hildegard Hismena Hosanna Hosannah Hosianna Housewife Hugolina Hugolinae Huguete Husewyf Husewyua Hysode Hyssmaye Ibbe Ibbet Ibbot Ibbota Ibot Ibota Ida Idemay Imagantia Imaigne Imania Imanie Imayn Imayne Imblen Imeyna Imme Immine Imyne Ingaret Ingaretta Ioetta Iohane Iohanna Ione Isa Isabeau Isabel Isabele Isabell Isabella Isabelle Isabelot Isamaya Isard Isata Isaut Iseldis Iselota Isemay Isemeine Iseuda Iseult Iseut Ishbel Ismania Ismanna Ismay Ismeina Ismena Ismenia Ismey Isobel Isobella Isold Isolda Isolde Isolt Isopel Isot Isota Isott Isotta Isouda Issabell Issabella Issat Issobell Issobella Isylte Ivetta Ivette Izett Izot Jacket Jacklin Jaclyn Jacoba Jacobina Jacqueline Jacquelle Jacquelyn Jacquetta Jahan Jakelina Jakemina Jaketta Jakolina James Jana Janat Jane Janet Janeta Jannet Jaquelinne Jaquelot Jasmine Jean Jeane Jeanette Jeanna Jeanne Jeene Jehane Jehanne Jehannete Jehannette Jehannote Jehenne Jenefer Jenet Jeneuer Jennet Jenny Jesmaine Jesmond Jessimond Jhone Jimme Jinny Jismond Jivete Joan Joane Joanette Joanna Jocea Jocey Jocosa Jodoca Joetta Johamma Johan Johana Johanna Johna Johne Johnnett Jone Jonet Joneta Jonetam Jonete Jonett Jonette Josse Josselyn Jossy Joyce Joyse Juicea Juliana Jyne Katelyn Katrina Kaylein Krea Kristyan Kyrstyan Libbe Libby Libet Lilian Lilias Lilion Lilla Lillian Lillias Lily Lina Linet Linette Linnet Linniue Linota Linyeve Linyive Lisa Liza Lizbeth Lizzie Loreena Luanda Luned Lunet Lunete Lylie Lynette Lyneue Lyonnete Maaline Maalot Macie Mactilda Mactildis Madallaine Madeleine Madelina Madlen Madlin Madlyn Maerwynn Magdalen Magdalene Magdalin Magdelne Maghenyld Maghtild Mahald Mahalt Mahaud Mahault Mahaut Mahenyld Maheut Mahhild Maleta Malie Malina Maline Malkin Malkyn Mall Malle Malleta Mallkin Mallot Mally Malot Malota Malt Maly Malyn Malyna Manel Maneld Manild Mare Marekyn Mareona Mareoun Margaret Margery Maria Marian Mariana Mariel Marina Marion Marione Mariora Mariorie Mariot Mariota Mariote Marioth Marioun Marioziota Mariun Marote Mary Maryell Masota Masse Mathe Matheld Mathila Mathild Mathildis Matild Matilda Matilde Matildis Matill Matilldis Matillis Mattie Matty Maud Maude Maudeleyn Maudelyn Maudlin Maughtild Mauld Maut Mautild Mawd Mawde Mawdelyn Mawt May Maynild Maysant Maysaunt Mechtild Mehenilda Meisent Melicent Melisant Melisenda Melisent Melisentia Melissent Meraud Merewen Merewina Merhild Meriall Meriel Merilda Merione Merwenna Meryall Meryld Merzone Metylda Milcentia Milesent Milessent Milicent Milicenta Milisandia Milisant Milisendis Milisent Milla Mille Millesant Millesenta Millicent Minnie Mirabelle Miriald Miriel Miriela Mirield Mirielda Mirielis Miriella Miriild Mirils Missa Mohaut Mold Molde Moll Molle Mollie Molly Molt Moolde Mott Motte Moude Moulde Moysant Moysent Murie Muriel Muriele Muriella Murienne Mylecent Mylisant Mylla Mylle Nan Nance Nancy Nanette Nanny Nanss Nibb Nina Ninette Ninon Nota Notekyn Odelina Odolina Orella Oriel Oriholt Oriold Oriolda Oriolt Osane Osanna Osanne Osenne Ossenna Ozanne Peronell Phrowenia Poll Pollekin Polly Rainydayas Rechemay Richarda Richardyne Richemaya Richemeya Richenda Richenza Richessa Richil Richild Richildis Richill Richmal Richoard Richolda Ricolda Rikild Rikilda Rikilde Rikmai Rochilda Roes Roese Roesia Roheis Roheisa Roheisia Rohese Rohesia Rohez Roisia Rokilda Roos Rosa Rosalind Rosalinda Rosaline Rosamond Rosamund Rosamunda Rose Roseaman Roseia Rosemond Rosemunda Rosomon Rossamond Rothais Royce Roysa Royse Roysia Rozeman Rychyld Ryia Rykeld Sabelina Sabeline Sadie Sairey Sal Sallie Sally Saloua Salove Sapphira Sapphire Sara Sarah Sarey Sari Sarra Sarre Sefare Sela Seloua Seloue Selova Seluue Sely Sephare Seraphina Shusan Shusanna Simmonete Simona Simone Sosanna Sueta Sueteluue Sukie Suky Sulley Sully Susan Susane Susanna Susannah Susanney Sweteloue Swetelove Swethyna Swetiue Swetyene Swetyne Sybbyl Symonne Tamasine Tamsin Tatsy Tatty Teffan Teffania Teffany Tephania Tephna Tetty Thamasin Thea Theffania Theffanie Theofania Theophania Thiphania Thomas Thomasia Thomasin Thomasina Thomasine Thomasse Thomassete Thomeson Thyphainne Tibb Tibby Tibota Tifaine Tiffan Tiffania Tiffany Tiffonia Tilda Till Tilla Tille Tillie Tillot Tillota Tillote Tilly Tiphina Tomson Tyfainne Tyffany Tyffayne Typhainne Typheinne Typhenete Typhenon Vanora Victoria Wander Wannore Wannour Wantelien Wantliana Wenefreda Wenthelen Wentiliana Williamina Wilmetta Wilmot Winefred Winifred Winnifred Wynifreed Xristiana Ybelote Ybot Yda Ymanie Ymanya Ymanye Ymeisna Ymenia Ysabel Ysabell Ysabella Ysabelle Ysabelon Ysabelot Ysabiau Ysemay Yseult Yseulte Ysmay Ysmeina Ysmena Ysmene Ysolt Ysoude Ysout Yvette Yvonne].freeze
    FEMALE_ELF_FIRST_NAMES = %w[Arara Amastrianna Antinua Birel Caelynn Chaedi Dara Drusilia Elama Enna Hatae Lelenia Keyleth Feyrre Melthrissa Aryana]

    NAME_PREFIX = %w[Axe Glow Blade Blood Bone Cloud Crag Crest Doom Dream Coven Elf Fern Feather Fire Fist Flame Forest Hammer Heart Hell Leaf Light Moon Rage River Rock Shade Shadow Shield Snow Spirit Star Steel Stone Swift Tree Whisper Wind Wolf Wood Gloom Glory Orb Ash Blaze Amber Autumn Barley Battle Bear Black Blue Boulder Bright Bronze Burning Cask Chest Cinder Clan Claw Clear Cliff Cold Common Crystal Dark Dawn Day Dead Death Deep Dew Dirge Distant Down Dragon Dusk Dust Eagle Earth Ember Even Far Flat Flint Fog Fore Four Free Frost Frozen Full Fuse Gold Horse Gore Grand Gray Grass Great Green Grizzly Hallow Hallowed Hard Hawk Haze Heavy Haven High Hill Holy Honor Forest Humble Hydra Ice Iron Keen Laughing Lightning Lion Lone Long Low Luna Marble Meadow Mild Mirth Mist Molten Monster Morning Moss Mountain Moon Mourn Mourning Night Noble Nose Oat Ocean Pale Peace Phoenix Pine Plain Pride Proud Pyre Rain Rapid Raven Red Regal Rich Rose Rough Rumble Rune Sacred Sage Saur Sea Serpent Sharp Silent Silver Simple Single Skull Sky Slate Smart Snake Soft Solid Spider Spring Stag Star Stern Still Storm Stout Strong Summer Sun Tall Three Thunder Titan True Truth Marsh Tusk Twilight Two Void War Wheat Whit White Wild Winter Wise Wyvern Young Alpen Crest Crow Fallen Farrow Haven Master Nether Nickle Raven River Stone Tarren Terra Water Willow Wooden].freeze

    NAME_POSTFIX = %w[axe glow beam blade blood bone cloud dane crag crest doom dream feather fire fist flame forest hammer heart hell leaf light moon rage river rock shade claw shadow shield snow spirit star steel stone swift tree whisper wind wolf wood gloom glory orb ash blaze arm arrow bane bash basher beard belly bend bender binder bleeder blight bloom blossom blower glade bluff bough bow brace braid branch brand breaker breath breeze brew bringer brook brow caller chaser reaper chewer cleaver creek crusher cut cutter dancer dew down draft dreamer drifter dust eye eyes fall fang flare flaw flayer flow follower flower force forge fury gaze gazer gem gleam glide grain grip grove guard gust hair hand helm hide horn hunter jumper keep keeper killer lance lash less mane mantle mark maul maw might more mourn oak ore peak pelt pike punch reaver rider ridge ripper roar run runner scar scream scribe seeker shaper shard shot shout singer sky slayer snarl snout soar song sorrow spark spear spell spire splitter sprinter stalker steam stream strength stride strider strike striker sun surge sword sworn tail taker talon thorn tide toe track trap trapper vale valor vigor walker ward watcher water weaver whirl whisk winds wing woods wound brooke fall fallow horn root shine swallow thorne willow wood].freeze

    def get_dragon_name
      "#{@names[:draconic][:prefixes].sample.capitalize}#{@names[:draconic][:suffixes].sample}"
    end

    def get_demon_name
      first_part = [:softs, :dulls, :sharps].sample
      second_part = [:softs, :dulls, :sharps].sample
      third_part = [:softs, :dulls, :sharps].sample
      name = "#{@names[:infernal][first_part].sample.capitalize}#{@names[:infernal][second_part].sample}"
      if rand < 0.3
        "#{name}-#{@names[:infernal][third_part].sample}"
      else
        name
      end
    end

    def get_goblin_name(gender = nil)
      "#{@names[:vileAndCrude][:small].sample.capitalize}#{rand(8) < 3 ? @names[:vileAndCrude][:small].sample : ''}#{!gender.nil? && gender == 'female' ? @names[:homely][:femaleSuffixes].sample : ''}"
    end

    def get_gnome_name(gender = nil)
      if rand < 0.5
        "#{@names[:faerykind][:prefixes].sample.capitalize}#{rand < 0.1 ? @names[:faerykind][:prefixes].sample : ''}#{!gender.nil? && gender == 'female' ? @names[:faerykind][:femaleSuffixes].sample : @names[:faerykind][:maleSuffixes].sample}"
      else
        "#{@names[:alternativeFaerykind][:prefixes].sample.capitalize}#{rand < 0.1 ? @names[:alternativeFaerykind][:prefixes].sample : ''}#{!gender.nil? && gender == 'female' ? @names[:alternativeFaerykind][:femaleSuffixes].sample : @names[:alternativeFaerykind][:maleSuffixes].sample}"
      end
    end

    def get_orc_name(gender = nil)
      "#{@names[:vileAndCrude][:medium].sample.capitalize}#{rand(8) < 5 ?@names[:vileAndCrude][:medium].sample : ''}#{!gender.nil? && gender == 'female' ? @names[:homely][:femaleSuffixes].sample : ''}"
    end

    def get_half_orc_name(gender = nil)
      name = "#{@names[:vileAndCrude][:medium].sample.capitalize}#{rand(8) < 5 ?@names[:vileAndCrude][:medium].sample : ''}"
      if !gender.nil? && gender == 'female'
        name = "#{name}#{@names[:homely][:femaleSuffixes].sample}"
      end
      "#{name} #{generate_surname(@surname_types.sample)}"
    end

    def get_ogre_name(gender = nil)
      "#{@names[:vileAndCrude][:large].sample.capitalize}#{rand(8) < 2 ? @names[:vileAndCrude][:large].sample : ''}#{!gender.nil? && gender == 'female' ? @names[:homely][:femaleSuffixes].sample : ''}"
    end

    def get_human_name(gender = nil)
      name = if gender.nil?
                (MALE_FIRST_NAMES + FEMALE_FIRST_NAMES).sample
              elsif gender == 'male'
                MALE_FIRST_NAMES.sample
              else
                FEMALE_FIRST_NAMES.sample
              end
      "#{name} #{generate_surname(@surname_types.sample)}"
    end

    def get_dwarf_name(gender = nil)
      syllables = @names[:doughty][:syllables]
      male_suffixes = @names[:doughty][:maleSuffixes]
      female_suffixes = @names[:doughty][:femaleSuffixes]
      name_prefix = ""
      (1..@num_syllables.sample).each { |i|
        name_prefix += i == 1 ? syllables.sample.capitalize : syllables.sample
      }
      generate_name(name_prefix, female_suffixes, gender, male_suffixes)
    end

    def get_elf_name(gender = nil)
      name_prefix = @names[:fairAndNoble][:elf_prefixes].sample.capitalize
      name_prefix += "'" if rand(10) < 3
      syllables = @names[:fairAndNoble][:middle]
      male_suffixes = @names[:fairAndNoble][:maleSuffixes]
      female_suffixes = @names[:fairAndNoble][:femaleSuffixes]
      total_syllables = @num_syllables.sample
      (1..total_syllables).each { |i|
        name_prefix += syllables.sample
        name_prefix += "'" if rand(10) < 3 && i < total_syllables
      }
      generate_name(name_prefix, female_suffixes, gender, male_suffixes, :elvish)
    end

    def get_halfling_name(gender = nil)
      syllables = @names[:homely][:syllables]
      male_suffixes = @names[:homely][:maleSuffixes]
      female_suffixes = @names[:homely][:femaleSuffixes]
      name_prefix = ""
      (1..rand(1..2)).each { |i|
        name_prefix += i == 1 ? syllables.sample.capitalize : syllables.sample
      }
      generate_name(name_prefix, female_suffixes, gender, male_suffixes)
    end

    def random_name(gender = nil, race = 'human')
      case race
      when 'human' then get_human_name(gender)
      when 'goblin' then get_goblin_name(gender)
      when 'orc' then get_orc_name(gender)
      when 'half_orc' then get_half_orc_name(gender)
      when 'ogre' then get_ogre_name(gender)
      when 'tiefling' then get_demon_name
      when 'gnome' then get_gnome_name(gender)
      when /dragon/ then get_dragon_name
      when /dwarf/ then get_dwarf_name(gender)
      when /elf/ then get_elf_name(gender)
      when /halfling/ then get_halfling_name(gender)
      else
        get_human_name(gender)
      end
    end

    def random_tavern_name
      options = {
        noun: @tavern_nouns.clone.map(&:clone),
        adjective: @tavern_adjectives.clone.map(&:clone),
        title: @tavern_titles.clone.map(&:clone)
      }
      tavern_name = ''
      pattern = @tavern_patterns.sample


      # def try_replacement(match)
      #   match = match.gsub(/<|>/, '')
      #   puts match
      # end
      # try_replacement(@tavern_patterns.first)
    end

    private

    def generate_name(name, female_suffixes, gender, male_suffixes, surname_type = :normal)
      name += if gender.nil?
                (male_suffixes + female_suffixes).sample
              elsif gender == 'male'
                male_suffixes.sample
              else
                female_suffixes.sample
              end
      "#{name} #{generate_surname(surname_type)}"
    end

    def generate_surname(type = :normal)
      if type == :normal
        "#{NAME_PREFIX.sample}#{NAME_POSTFIX.sample}"
      elsif type == :english
        "#{@names[:familyName][:english].sample}"
      elsif type == :elvish
        "#{@names[:fairAndNoble][:alternativeelf_prefixes].sample.capitalize}#{rand(4) < 2 ? @names[:fairAndNoble][:middle].sample : ''}#{@names[:fairAndNoble][:maleSuffixes].sample}"
      else
        "#{@names[:familyName][:scottish].sample}"
      end
    end
  end
end
