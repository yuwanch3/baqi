import { createAppContainer } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import {Button} from 'react-native'
import SplashScreen from '../Containers/SplashScreen'
import Login from '../Containers/Login'
import Register from '../Containers/Register'
import Home from '../Containers/Home'
import Users from '../Containers/Home/User'
import Cb from '../Containers/cb'
import UnderstandQuran from '../Containers/UnderstandQuran'
import Petrofisika from '../Containers/Petrofisika'
import PetroLevel from '../Containers/PetroLevel'
import SubLevel from '../Containers/SubLevel'
import Materi from '../Containers/Materi'
import Watch from '../Containers/Watch'
import Test from '../Containers/Test'
import Read from '../Containers/Read'
import Rangking from '../Containers/Rangking'
import Exam from '../Containers/Exam'
import HomeExam from '../Containers/HomeExam'
import FinalExam from '../Containers/FinalExam'
import ForgotPassword from '../Containers/ForgotPassword'
import Download from '../Containers/Download'
import Terms from '../Containers/Termsco'
import UbahPassword from '../Containers/UbahPassword'
import UbahProfil from '../Containers/UbahProfil'
import Group from '../Containers/Group'
import BuatGrup from '../Containers/Group/BuatGrup'
import GrupDetail from '../Containers/Group/GrupDetail'
import GrupSaya from '../Containers/Group/GrupSaya'
import Searchgrup from '../Containers/Group/Search'
import TambahMember from '../Containers/Group/TambahMember'
import SettingLanguage from '../Containers/Language'
import Maintenance from '../Containers/underMaintenance'
import Verification from '../Containers/Verification'

const AppNavigator = createStackNavigator(
  {
    SplashScreen: { screen: SplashScreen },
    Login: { screen: Login },
    Register: { screen: Register },
    Home: { screen: Home },
    Cb: { screen: Cb },
    ForgotPassword: { screen: ForgotPassword },
    UnderstandQuran: { screen: UnderstandQuran },
    Petrofisika: { screen: Petrofisika },
    PetroLevel: { screen: PetroLevel },
    SubLevel: { screen: SubLevel },
    Materi: { screen: Materi },
    Watch: { screen: Watch },
    Test: { screen: Test },
    Read: { screen: Read },
    Rangking: { screen: Rangking },
    Exam: { screen: Exam },
    HomeExam: { screen: HomeExam },
    FinalExam: { screen: FinalExam },
    Download: { screen: Download},
    Users: { screen: Users},
    Terms: { screen: Terms},
    UbahPassword: { screen: UbahPassword},
    UbahProfil: { screen: UbahProfil},
    Group: { screen: Group},
    BuatGrup: { screen: BuatGrup},
    GrupDetail: { screen: GrupDetail},
    GrupSaya: { screen: GrupSaya},
    Searchgrup: { screen: Searchgrup},
    TambahMember:{screen:TambahMember},
    SettingLanguage:{screen:SettingLanguage},
    Maintenance:{screen:Maintenance},
    Verification:{screen:Verification},

  },
  {
    headerMode: 'none',
    initialRouteName: 'SplashScreen',
  }
);

export default createAppContainer(AppNavigator)
